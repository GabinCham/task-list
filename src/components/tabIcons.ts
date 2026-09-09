import { Ionicons } from '@expo/vector-icons';
import type { TabIconName } from '../types';

const ICON_MAP: Record<TabIconName, keyof typeof Ionicons.glyphMap> = {
  list: 'list',
  home: 'home-outline',
  briefcase: 'briefcase-outline',
  cart: 'cart-outline',
  heart: 'heart-outline',
  star: 'star-outline',
  bookmark: 'bookmark-outline',
  calendar: 'calendar-outline',
};

export function tabIconName(icon: TabIconName): keyof typeof Ionicons.glyphMap {
  return ICON_MAP[icon] ?? 'list';
}
