import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, withAlpha } from '../theme/colors';
import {
  TAB_COLORS,
  TAB_ICON_OPTIONS,
  type TabIconName,
  type TabList,
} from '../types';
import { tabIconName } from './tabIcons';

type Props = {
  tab: TabList;
  visible: boolean;
  canDelete: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; icon: TabIconName; color: string }) => void;
  onResetAll: () => void;
  onDeleteTab: () => void;
};

export function CustomizeTabModal({
  tab,
  visible,
  canDelete,
  onClose,
  onSave,
  onResetAll,
  onDeleteTab,
}: Props) {
  const [name, setName] = useState(tab.name);
  const [icon, setIcon] = useState<TabIconName>(tab.icon);
  const [color, setColor] = useState(tab.color);

  useEffect(() => {
    if (!visible) return;
    setName(tab.name);
    setIcon(tab.icon);
    setColor(tab.color);
  }, [visible, tab]);

  const confirmReset = () => {
    Alert.alert(
      'Réinitialiser Listes ?',
      'Toutes les tâches et personnalisations seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            onResetAll();
            onClose();
          },
        },
      ],
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      'Supprimer cet onglet ?',
      `« ${tab.name} » et ses tâches seront supprimés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            onDeleteTab();
            onClose();
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <Text style={styles.heading}>Paramètres</Text>
          <Text style={styles.label}>Nom de l’onglet</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            maxLength={20}
            placeholder="Nom de l’onglet"
            placeholderTextColor={colors.inkMuted}
            autoFocus
          />

          <Text style={styles.label}>Icône</Text>
          <View style={styles.icons}>
            {TAB_ICON_OPTIONS.map((option) => {
              const selected = option === icon;
              return (
                <Pressable
                  key={option}
                  onPress={() => setIcon(option)}
                  style={[styles.iconBtn, selected && { backgroundColor: color }]}
                >
                  <Ionicons
                    name={tabIconName(option)}
                    size={22}
                    color={selected ? colors.plus : colors.white}
                  />
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Couleur</Text>
          <View style={styles.icons}>
            {TAB_COLORS.map((option) => {
              const selected = option === color;
              return (
                <Pressable
                  key={option}
                  onPress={() => setColor(option)}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: option },
                    selected && styles.colorBtnSelected,
                  ]}
                  accessibilityLabel={`Couleur ${option}`}
                />
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onSave({ name: name.trim() || tab.name, icon, color });
                onClose();
              }}
              style={[styles.saveBtn, { backgroundColor: color }]}
            >
              <Text style={styles.saveText}>Enregistrer</Text>
            </Pressable>
          </View>

          <View style={styles.dangerZone}>
            {canDelete ? (
              <Pressable
                onPress={confirmDelete}
                style={styles.dangerBtn}
                accessibilityRole="button"
              >
                <Text style={styles.dangerText}>Supprimer cet onglet</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={confirmReset}
              style={styles.resetBtn}
              accessibilityRole="button"
            >
              <Text style={styles.resetText}>Réinitialiser toutes les listes</Text>
            </Pressable>
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.white,
    marginBottom: 18,
  },
  icons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorBtnSelected: {
    borderColor: colors.white,
    transform: [{ scale: 1.08 }],
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  cancelText: {
    color: colors.white,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: colors.plus,
    fontWeight: '700',
  },
  dangerZone: {
    marginTop: 20,
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dangerBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
  },
  dangerText: {
    color: colors.danger,
    fontWeight: '700',
  },
  resetBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: withAlpha('#FFFFFF', 0.06),
  },
  resetText: {
    color: colors.inkMuted,
    fontWeight: '600',
  },
});
