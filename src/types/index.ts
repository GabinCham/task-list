export const TODAY_TAB_ID = 'today';
export const LEFTOVER_TAB_ID = 'leftover';
export const TODAY_COLOR = '#FF8C42';
export const LEFTOVER_COLOR = '#C77DFF';

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
  color: string;
  sections: [Section, Section, Section];
};

export type LeftoverDay = {
  date: string;
  todos: Todo[];
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
  lastRolloverDate: string;
  todayTodos: Todo[];
  leftoverDays: LeftoverDay[];
  tabs: TabList[];
};

export type NavTab = {
  id: string;
  name: string;
  icon: TabIconName;
  color: string;
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

export const TAB_COLORS = [
  '#FF8C42',
  '#4CC9F0',
  '#C77DFF',
  '#FF6B9D',
  '#7CFFB2',
  '#FFD166',
  '#5B8CFF',
  '#00F5D4',
  '#F15BB5',
  '#9B5DE5',
] as const;
