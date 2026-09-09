import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
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

type TabPos = { x: number; width: number };

export function CustomTabBar({ tabs, activeTabId, onSelect, onAddTab }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, TabPos>>({});
  const [layoutTick, setLayoutTick] = useState(0);

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTabId);
    if (index < 0) return;

    if (index === 0) {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
      return;
    }

    const previous = positions.current[tabs[index - 1].id];
    if (!previous) return;

    scrollRef.current?.scrollTo({
      x: Math.max(0, previous.x),
      animated: true,
    });
  }, [activeTabId, layoutTick, tabs]);

  return (
    <View
      style={[
        styles.bar,
        Platform.OS === 'web'
          ? ({
              paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
            } as unknown as ViewStyle)
          : { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
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
              hitSlop={8}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                const current = positions.current[tab.id];
                if (current?.x === x && current.width === width) return;
                positions.current[tab.id] = { x, width };
                setLayoutTick((tick) => tick + 1);
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
    backgroundColor: colors.background,
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
    minWidth: 72,
    maxWidth: 108,
    minHeight: 48,
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
