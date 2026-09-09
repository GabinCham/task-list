import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import {
  describeCloudError,
  fetchCloudSnapshot,
  isRemoteNewer,
  pushCloudData,
  seedCloudData,
  subscribeListStates,
  waitForSession,
  type CloudSnapshot,
} from '../storage/cloudSync';
import {
  applyDailyRollover,
  createDefaultData,
  createTab,
  createTodoId,
  loadExistingAppData,
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
  const lastPushedAt = useRef<string | null>(null);
  const forceCloudWrite = useRef(false);

  const applySnapshot = useCallback(
    (snapshot: CloudSnapshot, source: 'boot' | 'resume' | 'live') => {
      if (source !== 'boot' && cloudTimer.current) return;
      if (source !== 'boot' && !isRemoteNewer(snapshot.updatedAt, lastPushedAt.current)) {
        return;
      }
      lastPushedAt.current = snapshot.updatedAt;
      setData(snapshot.data);
      void saveAppData(snapshot.data, userId);
      setError(null);
    },
    [userId],
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await waitForSession();
        if (!mounted) return;

        const local = await loadExistingAppData(userId);
        if (!mounted) return;

        try {
          const remote = await fetchCloudSnapshot(userId);
          if (!mounted) return;

          if (remote) {
            lastPushedAt.current = remote.updatedAt;
            await saveAppData(remote.data, userId);
            setData(remote.data);
            return;
          }

          const next = local ?? createDefaultData();
          await saveAppData(next, userId);
          if (!mounted) return;
          const seeded = await seedCloudData(userId, next);
          if (!mounted) return;
          if (seeded) {
            lastPushedAt.current = seeded.updatedAt;
            await saveAppData(seeded.data, userId);
            setData(seeded.data);
            return;
          }
          lastPushedAt.current = null;
          setData(next);
        } catch (cloudError) {
          if (!mounted) return;
          setError(describeCloudError(cloudError));
          setData(local ?? createDefaultData());
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
          void pushCloudData(userId, snapshot, { force: forceCloudWrite.current })
            .then((result) => {
              forceCloudWrite.current = false;
              if (result.replacedWith) {
                applySnapshot(result.replacedWith, 'resume');
                return;
              }
              if (result.updatedAt) lastPushedAt.current = result.updatedAt;
            })
            .catch((cloudError) => {
              setError(describeCloudError(cloudError));
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
    const pullRemote = () => {
      void fetchCloudSnapshot(userId)
        .then((remote) => {
          if (remote) applySnapshot(remote, 'resume');
        })
        .catch((cloudError) => {
          setError(describeCloudError(cloudError));
        });
    };

    const timeoutId = setTimeout(runRollover, msUntilNextMidnight());
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        runRollover();
        pullRemote();
      }
    });

    const onVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        runRollover();
        pullRemote();
      }
    };
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisible);
    }

    return () => {
      clearTimeout(timeoutId);
      subscription.remove();
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisible);
      }
    };
  }, [applySnapshot, data?.lastRolloverDate, persist, userId]);

  useEffect(() => {
    if (loading) return;
    return subscribeListStates(userId, (snapshot) => {
      applySnapshot(snapshot, 'live');
    });
  }, [applySnapshot, loading, userId]);

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
    forceCloudWrite.current = true;
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
