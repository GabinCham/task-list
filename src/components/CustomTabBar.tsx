import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, withAlpha } from '../theme/colors';
import type { NavTab } from '../types';
import { tabIconName } from './tabIcons';

type Props = {
  tabs: NavTab[];
  activeTabId: string;
  onSelect: (tabId: string) => void;
  onAddTab: () => void;
};

export function CustomTabBar({ tabs, activeTabId, onSelect, onAddTab }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, { x: number; width: number }>>({});

  useEffect(() => {
    const item = positions.current[activeTabId];
    if (!item) return;
    const peek = 56;
    scrollRef.current?.scrollTo({
      x: Math.max(0, item.x - peek),
      animated: true,
    });
  }, [activeTabId, tabs]);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroller}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTabId;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onSelect(tab.id)}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                positions.current[tab.id] = { x, width };
              }}
              style={[
                styles.item,
                active && { backgroundColor: withAlpha(tab.color, 0.16) },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.name}
            >
              <Ionicons
                name={tabIconName(tab.icon)}
                size={20}
                color={active ? tab.color : colors.tabInactive}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: active ? colors.white : colors.tabInactive },
                ]}
              >
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable
        onPress={onAddTab}
        style={styles.addBtn}
        accessibilityRole="button"
        accessibilityLabel="Ajouter un onglet"
      >
        <Ionicons name="add" size={22} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 15, 23, 0.78)',
    paddingTop: 10,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  scroller: {
    flex: 1,
  },
  row: {
    paddingLeft: 10,
    paddingRight: 6,
    gap: 6,
    alignItems: 'center',
  },
  item: {
    minWidth: 68,
    maxWidth: 108,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha('#FFFFFF', 0.08),
    flexShrink: 0,
  },
});
