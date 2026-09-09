import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MeshGlow } from './MeshGlow';
import { authRedirectTo, isSupabaseConfigured, supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!supabase) {
      setMessage('Le cloud n’est pas encore configuré.');
      return;
    }

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || password.length < 6) {
      setMessage('Email + mot de passe (6 caractères min.).');
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: trimmed,
          password,
          options: { emailRedirectTo: authRedirectTo() },
        });
        if (error) throw error;
        setMessage('Compte créé. Si un mail de confirmation arrive, ouvre-le, puis reconnecte-toi.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.shell}>
      <MeshGlow accent={colors.now} />
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.brand}>Listes</Text>
        <Text style={styles.lead}>
          Un compte pour retrouver tes notes partout — même après avoir fermé
          l’app ou ouvert une fenêtre privée.
        </Text>

        {!isSupabaseConfigured ? (
          <Text style={styles.warn}>
            Cloud pas encore branché. Ajoute EXPO_PUBLIC_SUPABASE_URL et
            EXPO_PUBLIC_SUPABASE_ANON_KEY, puis relance.
          </Text>
        ) : null}

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="rgba(244, 246, 251, 0.35)"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Mot de passe"
          placeholderTextColor="rgba(244, 246, 251, 0.35)"
          style={styles.input}
        />

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Pressable
          onPress={() => void submit()}
          disabled={busy || !isSupabaseConfigured}
          style={[styles.primary, (busy || !isSupabaseConfigured) && styles.disabled]}
        >
          {busy ? (
            <ActivityIndicator color={colors.plus} />
          ) : (
            <Text style={styles.primaryText}>
              {mode === 'signup' ? 'Créer un compte' : 'Se connecter'}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setMessage(null);
          }}
          style={styles.switchBtn}
        >
          <Text style={styles.switchText}>
            {mode === 'signup'
              ? 'Déjà un compte ? Se connecter'
              : 'Pas de compte ? En créer un'}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    color: colors.foreground,
    letterSpacing: -1.2,
  },
  lead: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
    marginBottom: 12,
  },
  warn: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.now,
  },
  input: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.foreground,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.later,
  },
  primary: {
    marginTop: 8,
    backgroundColor: colors.now,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  primaryText: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.plus,
  },
  switchBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
});
