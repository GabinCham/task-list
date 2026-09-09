import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { fetchCloudData, pushCloudData } from '../storage/cloudSync';
import {
  applyDailyRollover,
  createDefaultData,
  createTab,
  createTodoId,
  loadAppData,
  nextTabColor,
  saveAppData,
} from '../storage/listsStorage';
import type { AppData, LeftoverDay, TabIconName, TabList, Todo } from '../types';
import { msUntilNextMidnight } from '../utils/dates';

function mapTab(data: AppData, tabId: string, mapper: (tab: TabList) => TabList): AppData {
  return {
    ...data,
    tabs: data.tabs.map((tab) => (tab.id === tabId ? mapper(tab) : tab)),
  };
}

function mapLeftoverDay(
  days: LeftoverDay[],
  date: string,
  mapper: (todos: Todo[]) => Todo[],
): LeftoverDay[] {
  return days
    .map((day) =>
      day.date === date ? { ...day, todos: mapper(day.todos) } : day,
    )
    .filter((day) => day.todos.length > 0);
}

export function useListsStore(userId: string) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cloudTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCloud = useRef<AppData | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const loaded = await loadAppData(userId);
        let next = loaded;
        try {
          const remote = await fetchCloudData(userId);
          if (remote) {
            next = remote;
            await saveAppData(remote, userId);
          } else {
            await pushCloudData(userId, loaded);
          }
        } catch {
          if (mounted) {
            setError('Hors ligne : tes listes restent sur cet appareil.');
          }
        }
        if (mounted) {
          setData(next);
        }
      } catch {
        if (mounted) {
          setData(createDefaultData());
          setError('Impossible de charger les listes.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const persist = useCallback(
    (updater: (prev: AppData) => AppData) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        pendingCloud.current = next;
        void (async () => {
          try {
            await saveAppData(next, userId);
            setError(null);
          } catch {
            setError('Impossible d’enregistrer les modifications.');
          }
        })();
        if (cloudTimer.current) clearTimeout(cloudTimer.current);
        cloudTimer.current = setTimeout(() => {
          const snapshot = pendingCloud.current;
          if (!snapshot) return;
          void pushCloudData(userId, snapshot).catch(() => {
            setError('Impossible de synchroniser le cloud.');
          });
        }, 500);
        return next;
      });
    },
    [userId],
  );

  useEffect(() => {
    if (!data) return;

    const runRollover = () => persist((prev) => applyDailyRollover(prev));

    const timeoutId = setTimeout(runRollover, msUntilNextMidnight());
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') runRollover();
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.remove();
    };
  }, [data?.lastRolloverDate, persist]);

  const updateTab = useCallback(
    (
      tabId: string,
      updates: { name?: string; icon?: TabIconName; color?: string },
    ) => {
      persist((prev) => mapTab(prev, tabId, (tab) => ({ ...tab, ...updates })));
    },
    [persist],
  );

  const updateSectionTitle = useCallback(
    (tabId: string, sectionId: string, title: string) => {
      persist((prev) =>
        mapTab(prev, tabId, (tab) => ({
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId ? { ...section, title } : section,
          ) as TabList['sections'],
        })),
      );
    },
    [persist],
  );

  const addTodo = useCallback(
    (tabId: string, sectionId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const todo: Todo = {
        id: createTodoId(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      persist((prev) =>
        mapTab(prev, tabId, (tab) => ({
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? { ...section, todos: [todo, ...section.todos] }
              : section,
          ) as TabList['sections'],
        })),
      );
    },
    [persist],
  );

  const toggleTodo = useCallback(
    (tabId: string, sectionId: string, todoId: string) => {
      persist((prev) =>
        mapTab(prev, tabId, (tab) => ({
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: section.todos.map((item) =>
                    item.id === todoId
                      ? { ...item, completed: !item.completed }
                      : item,
                  ),
                }
              : section,
          ) as TabList['sections'],
        })),
      );
    },
    [persist],
  );

  const deleteTodo = useCallback(
    (tabId: string, sectionId: string, todoId: string) => {
      persist((prev) =>
        mapTab(prev, tabId, (tab) => ({
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: section.todos.filter((item) => item.id !== todoId),
                }
              : section,
          ) as TabList['sections'],
        })),
      );
    },
    [persist],
  );

  const addTodayTodo = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const todo: Todo = {
        id: createTodoId(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      };
      persist((prev) => ({
        ...prev,
        todayTodos: [todo, ...prev.todayTodos],
      }));
    },
    [persist],
  );

  const toggleTodayTodo = useCallback(
    (todoId: string) => {
      persist((prev) => ({
        ...prev,
        todayTodos: prev.todayTodos.map((item) =>
          item.id === todoId ? { ...item, completed: !item.completed } : item,
        ),
      }));
    },
    [persist],
  );

  const deleteTodayTodo = useCallback(
    (todoId: string) => {
      persist((prev) => ({
        ...prev,
        todayTodos: prev.todayTodos.filter((item) => item.id !== todoId),
      }));
    },
    [persist],
  );

  const toggleLeftoverTodo = useCallback(
    (date: string, todoId: string) => {
      persist((prev) => ({
        ...prev,
        leftoverDays: mapLeftoverDay(prev.leftoverDays, date, (todos) =>
          todos.map((item) =>
            item.id === todoId ? { ...item, completed: !item.completed } : item,
          ),
        ),
      }));
    },
    [persist],
  );

  const deleteLeftoverTodo = useCallback(
    (date: string, todoId: string) => {
      persist((prev) => ({
        ...prev,
        leftoverDays: mapLeftoverDay(prev.leftoverDays, date, (todos) =>
          todos.filter((item) => item.id !== todoId),
        ),
      }));
    },
    [persist],
  );

  const addTab = useCallback((): string => {
    const tab = createTab({
      name: 'Liste',
      icon: 'list',
      color: '#FF8C42',
    });
    persist((prev) => ({
      ...prev,
      tabs: [
        ...prev.tabs,
        {
          ...tab,
          name: `Liste ${prev.tabs.length + 1}`,
          color: nextTabColor(prev.tabs.map((item) => item.color)),
        },
      ],
    }));
    return tab.id;
  }, [persist]);

  const deleteTab = useCallback(
    (tabId: string) => {
      persist((prev) => {
        if (prev.tabs.length <= 1) return prev;
        return { ...prev, tabs: prev.tabs.filter((tab) => tab.id !== tabId) };
      });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    persist(() => createDefaultData());
  }, [persist]);

  return {
    data,
    loading,
    error,
    updateTab,
    updateSectionTitle,
    addTodo,
    toggleTodo,
    deleteTodo,
    addTodayTodo,
    toggleTodayTodo,
    deleteTodayTodo,
    toggleLeftoverTodo,
    deleteLeftoverTodo,
    addTab,
    deleteTab,
    resetAll,
  };
}
