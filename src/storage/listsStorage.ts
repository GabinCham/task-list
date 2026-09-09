import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TAB_COLORS,
  type AppData,
  type LeftoverDay,
  type Section,
  type TabIconName,
  type TabList,
  type Todo,
} from '../types';
import { localDateKey } from '../utils/dates';

const STORAGE_KEY = '@listes/app-data-v3';
const LEGACY_KEYS = ['@listes/app-data-v2', '@listes/app-data-v1'];

function storageKeyFor(userId?: string) {
  return userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
}

function createSection(title: string, index: number): Section {
  return {
    id: `section-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    todos: [],
  };
}

export function nextTabColor(existingColors: string[]): string {
  const unused = TAB_COLORS.find((color) => !existingColors.includes(color));
  return unused ?? TAB_COLORS[existingColors.length % TAB_COLORS.length];
}

function defaultSections(titles: [string, string, string]): TabList['sections'] {
  return titles.map((title, sectionIndex) =>
    createSection(title, sectionIndex),
  ) as TabList['sections'];
}

export function createTab(input: {
  name: string;
  icon: TabIconName;
  color: string;
  sectionTitles?: [string, string, string];
}): TabList {
  return {
    id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name,
    icon: input.icon,
    color: input.color,
    sections: defaultSections(
      input.sectionTitles ?? [
        'Tout de suite, aujourd’hui',
        'Plus tard, à faire',
        'Dans un coin de ma tête, à faire un jour',
      ],
    ),
  };
}

export function createDefaultData(): AppData {
  const defaults: Array<{
    name: string;
    icon: TabIconName;
    sections: [string, string, string];
  }> = [
    {
      name: 'Maison',
      icon: 'home',
      sections: [
        'Tout de suite, aujourd’hui',
        'Plus tard, à faire',
        'Dans un coin de ma tête, à faire un jour',
      ],
    },
    {
      name: 'Travail',
      icon: 'briefcase',
      sections: ['Urgent', 'Cette semaine', 'Plus tard'],
    },
    {
      name: 'Courses',
      icon: 'cart',
      sections: ['Fruits & légumes', 'Épicerie', 'Divers'],
    },
    { name: 'Idées', icon: 'star', sections: ['À explorer', 'En cours', 'Archivées'] },
  ];

  return {
    lastRolloverDate: localDateKey(),
    todayTodos: [],
    leftoverDays: [],
    tabs: defaults.map((tab, tabIndex) => ({
      ...createTab({
        name: tab.name,
        icon: tab.icon,
        color: TAB_COLORS[tabIndex],
        sectionTitles: tab.sections,
      }),
      id: `tab-${tabIndex + 1}`,
    })),
  };
}

function isTabIcon(value: unknown): value is TabIconName {
  return (
    value === 'list' ||
    value === 'home' ||
    value === 'briefcase' ||
    value === 'cart' ||
    value === 'heart' ||
    value === 'star' ||
    value === 'bookmark' ||
    value === 'calendar'
  );
}

function normalizeTab(raw: Partial<TabList> | undefined, index: number): TabList | null {
  if (!raw || !Array.isArray(raw.sections) || raw.sections.length !== 3) {
    return null;
  }

  const sections = raw.sections.map((section, sectionIndex) => ({
    id: section?.id || `section-${sectionIndex}-${index}`,
    title: section?.title?.trim() || `Section ${sectionIndex + 1}`,
    todos: Array.isArray(section?.todos) ? section.todos : [],
  })) as TabList['sections'];

  return {
    id: raw.id || `tab-${index + 1}`,
    name: raw.name?.trim() || `Liste ${index + 1}`,
    icon: isTabIcon(raw.icon) ? raw.icon : 'list',
    color: raw.color || TAB_COLORS[index % TAB_COLORS.length],
    sections,
  };
}

function normalizeTodos(raw: unknown): Todo[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item) => item && typeof item.text === 'string' && typeof item.id === 'string');
}

function normalizeLeftover(raw: unknown): LeftoverDay[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((day) => {
      if (!day || typeof day.date !== 'string') return null;
      const todos = normalizeTodos(day.todos);
      if (todos.length === 0) return null;
      return { date: day.date, todos };
    })
    .filter((day): day is LeftoverDay => day !== null);
}

function mergeLeftoverDay(
  days: LeftoverDay[],
  date: string,
  todos: Todo[],
): LeftoverDay[] {
  if (todos.length === 0) return days;
  const existing = days.find((day) => day.date === date);
  if (!existing) {
    return [{ date, todos }, ...days];
  }
  return days.map((day) =>
    day.date === date ? { ...day, todos: [...todos, ...day.todos] } : day,
  );
}

export function applyDailyRollover(data: AppData, now = new Date()): AppData {
  const today = localDateKey(now);
  if (data.lastRolloverDate === today) {
    return data;
  }

  const unfinished = data.todayTodos.filter((todo) => !todo.completed);
  return {
    ...data,
    lastRolloverDate: today,
    todayTodos: [],
    leftoverDays: mergeLeftoverDay(data.leftoverDays, data.lastRolloverDate, unfinished),
  };
}

export function parseAppData(parsed: unknown): AppData | null {
  if (!parsed || typeof parsed !== 'object' || !('tabs' in parsed)) {
    return null;
  }

  const raw = parsed as Partial<AppData>;
  if (!Array.isArray(raw.tabs) || raw.tabs.length === 0) {
    return null;
  }

  const tabs = raw.tabs
    .map((tab, index) => normalizeTab(tab, index))
    .filter((tab): tab is TabList => tab !== null);

  if (tabs.length === 0) {
    return null;
  }

  const today = localDateKey();
  const lastRolloverDate =
    typeof raw.lastRolloverDate === 'string' && raw.lastRolloverDate.length >= 8
      ? raw.lastRolloverDate
      : today;

  return applyDailyRollover({
    lastRolloverDate,
    todayTodos: normalizeTodos(raw.todayTodos),
    leftoverDays: normalizeLeftover(raw.leftoverDays),
    tabs,
  });
}

export async function loadAppData(userId?: string): Promise<AppData> {
  try {
    let raw = await AsyncStorage.getItem(storageKeyFor(userId));
    if (!raw && !userId) {
      for (const key of LEGACY_KEYS) {
        raw = await AsyncStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw && userId) {
      raw = await AsyncStorage.getItem(STORAGE_KEY);
    }

    if (!raw) {
      const defaults = createDefaultData();
      await saveAppData(defaults, userId);
      return defaults;
    }

    const normalized = parseAppData(JSON.parse(raw));
    if (!normalized) {
      const defaults = createDefaultData();
      await saveAppData(defaults, userId);
      return defaults;
    }

    await saveAppData(normalized, userId);
    return normalized;
  } catch {
    return createDefaultData();
  }
}

export async function saveAppData(data: AppData, userId?: string): Promise<void> {
  await AsyncStorage.setItem(storageKeyFor(userId), JSON.stringify(data));
}

export function createTodoId(): string {
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
