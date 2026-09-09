import { createContext, useContext, type ReactNode } from 'react';
import { useListsStore } from '../hooks/useListsStore';

type ListsStore = ReturnType<typeof useListsStore>;

const ListsContext = createContext<ListsStore | null>(null);

export function ListsProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const store = useListsStore(userId);
  return (
    <ListsContext.Provider value={store}>{children}</ListsContext.Provider>
  );
}

export function useLists(): ListsStore {
  const ctx = useContext(ListsContext);
  if (!ctx) {
    throw new Error('useLists must be used within ListsProvider');
  }
  return ctx;
}
