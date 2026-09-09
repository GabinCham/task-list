export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export type Section = {
  id: string;
  title: string;
  todos: Todo[];
};

export type TabList = {
  id: string;
  name: string;
  icon: TabIconName;
  sections: [Section, Section, Section];
};

export type TabIconName =
  | 'list'
  | 'home'
  | 'briefcase'
  | 'cart'
  | 'heart'
  | 'star'
  | 'bookmark'
  | 'calendar';

export type AppData = {
  tabs: [TabList, TabList, TabList, TabList];
};

export const TAB_ICON_OPTIONS: TabIconName[] = [
  'list',
  'home',
  'briefcase',
  'cart',
  'heart',
  'star',
  'bookmark',
  'calendar',
];
