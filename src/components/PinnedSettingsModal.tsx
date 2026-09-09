import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, withAlpha } from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onResetAll: () => void;
};

export function PinnedSettingsModal({ visible, onClose, onResetAll }: Props) {
  const { user, signOut } = useAuth();

  const confirmReset = () => {
    const run = () => {
      onResetAll();
      onClose();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Réinitialiser toutes les listes ?')) run();
      return;
    }

    Alert.alert(
      'Réinitialiser Listes ?',
      'Toutes les tâches et personnalisations seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: run,
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
            Tes listes sont enregistrées sur ton compte. Tu peux fermer l’app ou
            passer en navigation privée : reconnecte-toi et elles reviennent.
          </Text>
          {user?.email ? (
            <Text style={styles.account}>{user.email}</Text>
          ) : null}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Fermer</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              void signOut();
              onClose();
            }}
            style={styles.resetBtn}
          >
            <Text style={styles.resetText}>Se déconnecter</Text>
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
    marginBottom: 4,
  },
  account: {
    fontSize: 14,
    color: colors.later,
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
