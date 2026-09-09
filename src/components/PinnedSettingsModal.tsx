import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, withAlpha } from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onResetAll: () => void;
};

export function PinnedSettingsModal({ visible, onClose, onResetAll }: Props) {
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>Paramètres</Text>
          <Text style={styles.copy}>
            L’onglet du jour se vide chaque nuit à minuit. Ce qui n’est pas
            coché part dans Fais pour.
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Fermer</Text>
          </Pressable>
          <Pressable
            onPress={confirmReset}
            style={styles.resetBtn}
            accessibilityRole="button"
          >
            <Text style={styles.resetText}>Réinitialiser toutes les listes</Text>
          </Pressable>
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
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
    marginBottom: 8,
  },
  closeBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  closeText: {
    color: colors.white,
    fontWeight: '600',
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
