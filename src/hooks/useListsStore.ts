import { useCallback, useEffect, useState } from 'react';
import {
  createDefaultData,
  createTodoId,
  loadAppData,
  saveAppData,
} from '../storage/listsStorage';
import type { AppData, TabIconName, Todo } from '../types';

export function useListsStore() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const loaded = await loadAppData();
        if (mounted) {
          setData(loaded);
          setError(null);
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
  }, []);

  const persist = useCallback(async (next: AppData) => {
    setData(next);
    try {
      await saveAppData(next);
      setError(null);
    } catch {
      setError('Impossible d’enregistrer les modifications.');
    }
  }, []);

  const updateTab = useCallback(
    (tabId: string, updates: { name?: string; icon?: TabIconName }) => {
      if (!data) return;
      const tabs = data.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, ...updates } : tab,
      ) as AppData['tabs'];
      void persist({ tabs });
    },
    [data, persist],
  );

  const updateSectionTitle = useCallback(
    (tabId: string, sectionId: string, title: string) => {
      if (!data) return;
      const tabs = data.tabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId ? { ...section, title } : section,
          ) as AppData['tabs'][number]['sections'],
        };
      }) as AppData['tabs'];
      void persist({ tabs });
    },
    [data, persist],
  );

  const addTodo = useCallback(
    (tabId: string, sectionId: string, text: string) => {
      if (!data) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      const todo: Todo = {
        id: createTodoId(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      const tabs = data.tabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? { ...section, todos: [todo, ...section.todos] }
              : section,
          ) as AppData['tabs'][number]['sections'],
        };
      }) as AppData['tabs'];
      void persist({ tabs });
    },
    [data, persist],
  );

  const toggleTodo = useCallback(
    (tabId: string, sectionId: string, todoId: string) => {
      if (!data) return;
      const tabs = data.tabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: section.todos.map((todo) =>
                    todo.id === todoId
                      ? { ...todo, completed: !todo.completed }
                      : todo,
                  ),
                }
              : section,
          ) as AppData['tabs'][number]['sections'],
        };
      }) as AppData['tabs'];
      void persist({ tabs });
    },
    [data, persist],
  );

  const deleteTodo = useCallback(
    (tabId: string, sectionId: string, todoId: string) => {
      if (!data) return;
      const tabs = data.tabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  todos: section.todos.filter((todo) => todo.id !== todoId),
                }
              : section,
          ) as AppData['tabs'][number]['sections'],
        };
      }) as AppData['tabs'];
      void persist({ tabs });
    },
    [data, persist],
  );

  const resetAll = useCallback(async () => {
    const defaults = createDefaultData();
    await persist(defaults);
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
    resetAll,
  };
}
