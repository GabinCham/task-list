import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { TAB_ICON_OPTIONS, type TabIconName, type TabList } from '../types';
import { tabIconName } from './tabIcons';

type Props = {
  tab: TabList;
  visible: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; icon: TabIconName }) => void;
};

export function CustomizeTabModal({ tab, visible, onClose, onSave }: Props) {
  const [name, setName] = useState(tab.name);
  const [icon, setIcon] = useState<TabIconName>(tab.icon);

  const handleOpen = () => {
    setName(tab.name);
    setIcon(tab.icon);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onShow={handleOpen}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>Personnaliser l’onglet</Text>
          <Text style={styles.label}>Nom</Text>
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
                  style={[styles.iconBtn, selected && styles.iconBtnSelected]}
                >
                  <Ionicons
                    name={tabIconName(option)}
                    size={22}
                    color={selected ? colors.white : colors.ink}
                  />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onSave({ name: name.trim() || tab.name, icon });
                onClose();
              }}
              style={styles.saveBtn}
            >
              <Text style={styles.saveText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 43, 36, 0.45)',
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
    color: colors.ink,
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
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 18,
  },
  icons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBtnSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
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
    color: colors.ink,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  saveText: {
    color: colors.white,
    fontWeight: '700',
  },
});
