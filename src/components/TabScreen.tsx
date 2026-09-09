import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import type { TabIconName, TabList } from '../types';
import { CustomizeTabModal } from './CustomizeTabModal';
import { SectionBlock } from './SectionBlock';

type Props = {
  tab: TabList;
  onUpdateTab: (updates: { name?: string; icon?: TabIconName }) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onAddTodo: (sectionId: string, text: string) => void;
  onToggleTodo: (sectionId: string, todoId: string) => void;
  onDeleteTodo: (sectionId: string, todoId: string) => void;
  onResetAll: () => void;
};

export function TabScreen({
  tab,
  onUpdateTab,
  onUpdateSectionTitle,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onResetAll,
}: Props) {
  const insets = useSafeAreaInsets();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const openReset = () => {
    Alert.alert(
      'Réinitialiser Listes ?',
      'Toutes les tâches et personnalisations seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réinitialiser', style: 'destructive', onPress: onResetAll },
      ],
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Listes</Text>
          <Text style={styles.tabName}>{tab.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setCustomizeOpen(true)}
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>Onglet</Text>
          </Pressable>
          <Pressable onPress={openReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {tab.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            onRename={(title) => onUpdateSectionTitle(section.id, title)}
            onAddTodo={(text) => onAddTodo(section.id, text)}
            onToggleTodo={(todoId) => onToggleTodo(section.id, todoId)}
            onDeleteTodo={(todoId) => onDeleteTodo(section.id, todoId)}
          />
        ))}
      </ScrollView>

      <CustomizeTabModal
        tab={tab}
        visible={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        onSave={onUpdateTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  tabName: {
    marginTop: 2,
    fontSize: 30,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headerBtn: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  headerBtnText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  resetText: {
    color: colors.inkMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
});
