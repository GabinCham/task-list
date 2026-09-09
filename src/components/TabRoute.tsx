import { useLists } from '../context/ListsContext';
import { TabScreen } from './TabScreen';

type Props = {
  tabId: string;
};

export function TabRoute({ tabId }: Props) {
  const store = useLists();
  const tab = store.data?.tabs.find((item) => item.id === tabId);

  if (!tab) {
    return null;
  }

  return (
    <TabScreen
      tab={tab}
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
      onResetAll={() => {
        void store.resetAll();
      }}
    />
  );
}
