import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Section, TabList } from '../types';

const STORAGE_KEY = '@listes/app-data-v1';

function createSection(title: string, index: number): Section {
  return {
    id: `section-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    todos: [],
  };
}

export function createDefaultData(): AppData {
  const defaults: Array<Pick<TabList, 'name' | 'icon'> & { sections: [string, string, string] }> = [
    { name: 'Perso', icon: 'home', sections: ['Matin', 'Journée', 'Soir'] },
    { name: 'Travail', icon: 'briefcase', sections: ['Urgent', 'Cette semaine', 'Plus tard'] },
    { name: 'Courses', icon: 'cart', sections: ['Fruits & légumes', 'Épicerie', 'Divers'] },
    { name: 'Idées', icon: 'star', sections: ['À explorer', 'En cours', 'Archivées'] },
  ];

  return {
    tabs: defaults.map((tab, tabIndex) => ({
      id: `tab-${tabIndex + 1}`,
      name: tab.name,
      icon: tab.icon,
      sections: tab.sections.map((title, sectionIndex) =>
        createSection(title, sectionIndex),
      ) as [Section, Section, Section],
    })) as AppData['tabs'],
  };
}

export async function loadAppData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = createDefaultData();
      await saveAppData(defaults);
      return defaults;
    }

    const parsed = JSON.parse(raw) as AppData;
    if (!parsed?.tabs || parsed.tabs.length !== 4) {
      const defaults = createDefaultData();
      await saveAppData(defaults);
      return defaults;
    }

    return parsed;
  } catch {
    return createDefaultData();
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createTodoId(): string {
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
