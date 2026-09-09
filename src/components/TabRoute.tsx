import {
  LEFTOVER_TAB_ID,
  TODAY_TAB_ID,
} from '../types';
import { useLists } from '../context/ListsContext';
import { LeftoverScreen } from './LeftoverScreen';
import { TabScreen } from './TabScreen';
import { TodayScreen } from './TodayScreen';

type Props = {
  tabId: string;
};

export function TabRoute({ tabId }: Props) {
  const store = useLists();

  if (tabId === TODAY_TAB_ID) {
    return (
      <TodayScreen
        todos={store.data?.todayTodos ?? []}
        onAddTodo={store.addTodayTodo}
        onToggleTodo={store.toggleTodayTodo}
        onDeleteTodo={store.deleteTodayTodo}
        onResetAll={store.resetAll}
      />
    );
  }

  if (tabId === LEFTOVER_TAB_ID) {
    return (
      <LeftoverScreen
        leftoverDays={store.data?.leftoverDays ?? []}
        onToggleTodo={store.toggleLeftoverTodo}
        onDeleteTodo={store.deleteLeftoverTodo}
        onResetAll={store.resetAll}
      />
    );
  }

  const tab = store.data?.tabs.find((item) => item.id === tabId);
  const canDelete = (store.data?.tabs.length ?? 0) > 1;

  if (!tab) {
    return null;
  }

  return (
    <TabScreen
      tab={tab}
      canDelete={canDelete}
      onUpdateTab={(updates) => store.updateTab(tab.id, updates)}
      onUpdateSectionTitle={(sectionId, title) =>
        store.updateSectionTitle(tab.id, sectionId, title)
      }
      onAddTodo={(sectionId, text) => store.addTodo(tab.id, sectionId, text)}
      onToggleTodo={(sectionId, todoId) =>
        store.toggleTodo(tab.id, sectionId, todoId)
      }
      onDeleteTodo={(sectionId, todoId) =>
        store.deleteTodo(tab.id, sectionId, todoId)
      }
      onResetAll={() => store.resetAll()}
      onDeleteTab={() => store.deleteTab(tab.id)}
    />
  );
}
