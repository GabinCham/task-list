import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import type { LeftoverDay } from '../types';
import { localDateKey } from '../utils/dates';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (date: string, text: string) => void;
  scheduledDays: LeftoverDay[];
};

const monthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
});
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function ScheduleTaskModal({ visible, onClose, onAdd, scheduledDays }: Props) {
  const today = localDateKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [draft, setDraft] = useState('');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const days = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const count = new Date(year, monthIndex + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: count }, (_, index) => index + 1),
    ];
  }, [month]);
  const scheduledForSelectedDate = scheduledDays.find((day) => day.date === selectedDate)?.todos ?? [];

  const selectDay = (day: number) => {
    const next = dateKey(month.getFullYear(), month.getMonth(), day);
    if (next >= today) setSelectedDate(next);
  };

  const addTask = () => {
    if (!draft.trim()) return;
    onAdd(selectedDate, draft);
    setDraft('');
    onClose();
  };

  const moveMonth = (delta: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Planifier une tâche</Text>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel="Fermer">
              <Ionicons name="close" size={22} color={colors.inkMuted} />
            </Pressable>
          </View>

          <View style={styles.monthRow}>
            <Pressable onPress={() => moveMonth(-1)} style={styles.monthButton} accessibilityLabel="Mois précédent">
              <Ionicons name="chevron-back" size={20} color={colors.foreground} />
            </Pressable>
            <Text style={styles.monthLabel}>{monthFormatter.format(month)}</Text>
            <Pressable onPress={() => moveMonth(1)} style={styles.monthButton} accessibilityLabel="Mois suivant">
              <Ionicons name="chevron-forward" size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <View style={styles.weekdays}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((label, index) => (
              <Text key={`${label}-${index}`} style={styles.weekday}>{label}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {days.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
              const key = dateKey(month.getFullYear(), month.getMonth(), day);
              const disabled = key < today;
              const selected = key === selectedDate;
              const scheduledCount = scheduledDays.find((item) => item.date === key)?.todos.length ?? 0;
              return (
                <Pressable
                  key={key}
                  onPress={() => selectDay(day)}
                  disabled={disabled}
                  style={[styles.dayCell, selected && styles.daySelected]}
                  accessibilityLabel={`Choisir le ${day}`}
                >
                  <Text style={[styles.dayText, disabled && styles.dayDisabled, selected && styles.daySelectedText]}>{day}</Text>
                  {scheduledCount > 0 ? <View style={[styles.scheduleDot, selected && styles.scheduleDotSelected]} /> : null}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.selectedDate}>Pour le {dateFormatter.format(new Date(`${selectedDate}T12:00:00`))}</Text>
          {scheduledForSelectedDate.length > 0 ? (
            <View style={styles.plannedList}>
              <Text style={styles.plannedLabel}>Déjà programmé</Text>
              {scheduledForSelectedDate.map((todo) => (
                <View key={todo.id} style={styles.plannedItem}>
                  <View style={styles.plannedBullet} />
                  <Text style={styles.plannedText}>{todo.text}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={addTask}
            placeholder="Tâche à planifier…"
            placeholderTextColor="rgba(244, 246, 251, 0.35)"
            style={styles.input}
            returnKeyType="done"
            maxLength={160}
          />
          <Pressable onPress={addTask} style={[styles.addButton, !draft.trim() && styles.addButtonDisabled]} disabled={!draft.trim()}>
            <Text style={styles.addButtonText}>Ajouter à cette date</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.58)' },
  sheet: { backgroundColor: colors.backgroundAlt, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 34 },
  handle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: 'rgba(244, 246, 251, 0.22)', marginBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { color: colors.foreground, fontSize: 21, fontWeight: '700' },
  closeButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  monthButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { color: colors.foreground, fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  weekdays: { flexDirection: 'row' },
  weekday: { width: '14.2857%', textAlign: 'center', color: colors.inkMuted, fontSize: 12, fontWeight: '700', paddingVertical: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  daySelected: { backgroundColor: colors.now },
  dayText: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  dayDisabled: { color: 'rgba(244, 246, 251, 0.2)' },
  daySelectedText: { color: colors.background },
  scheduleDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.later, marginTop: 2 },
  scheduleDotSelected: { backgroundColor: colors.background },
  selectedDate: { color: colors.inkMuted, fontSize: 13, marginTop: 14, marginBottom: 8 },
  plannedList: { borderLeftWidth: 2, borderLeftColor: colors.later, gap: 6, marginBottom: 10, paddingLeft: 10 },
  plannedLabel: { color: colors.later, fontSize: 12, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  plannedItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  plannedBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.inkMuted },
  plannedText: { color: colors.foreground, flex: 1, fontSize: 14 },
  input: { color: colors.foreground, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  addButton: { alignItems: 'center', backgroundColor: colors.now, borderRadius: 14, marginTop: 10, paddingVertical: 14 },
  addButtonDisabled: { opacity: 0.42 },
  addButtonText: { color: colors.background, fontSize: 15, fontWeight: '800' },
});
