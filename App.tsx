import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthScreen } from './src/components/AuthScreen';
import { CustomTabBar } from './src/components/CustomTabBar';
import { MeshGlow } from './src/components/MeshGlow';
import { TabRoute } from './src/components/TabRoute';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ListsProvider, useLists } from './src/context/ListsContext';
import { colors } from './src/theme/colors';
import { fonts, useAppFonts } from './src/theme/fonts';
import {
  LEFTOVER_COLOR,
  LEFTOVER_TAB_ID,
  TODAY_COLOR,
  TODAY_TAB_ID,
  type NavTab,
} from './src/types';

function AppNavigator() {
  const store = useLists();
  const [selectedTabId, setSelectedTabId] = useState<string | null>(TODAY_TAB_ID);

  const userTabs = store.data?.tabs ?? [];
  const navTabs: NavTab[] = useMemo(
    () => [
      {
        id: TODAY_TAB_ID,
        name: 'Aujourd’hui',
        icon: 'calendar',
        color: TODAY_COLOR,
      },
      ...userTabs.map((tab) => ({
        id: tab.id,
        name: tab.name,
        icon: tab.icon,
        color: tab.color,
      })),
      {
        id: LEFTOVER_TAB_ID,
        name: 'Fais pour',
        icon: 'bookmark',
        color: LEFTOVER_COLOR,
      },
    ],
    [userTabs],
  );

  const activeTabId = useMemo(() => {
    if (navTabs.some((tab) => tab.id === selectedTabId)) {
      return selectedTabId as string;
    }
    return TODAY_TAB_ID;
  }, [selectedTabId, navTabs]);

  const activeAccent =
    navTabs.find((tab) => tab.id === activeTabId)?.color ?? TODAY_COLOR;

  if (store.loading || !store.data) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootBrand}>Listes</Text>
        <ActivityIndicator color={colors.now} size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <MeshGlow accent={activeAccent} />
      <StatusBar style="light" />
      {store.error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{store.error}</Text>
        </View>
      ) : null}
      <View style={styles.screen}>
        {activeTabId ? <TabRoute key={activeTabId} tabId={activeTabId} /> : null}
      </View>
      <CustomTabBar
        tabs={navTabs}
        activeTabId={activeTabId}
        onSelect={setSelectedTabId}
        onAddTab={() => {
          const id = store.addTab();
          if (id) setSelectedTabId(id);
        }}
      />
    </View>
  );
}

export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.now} size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootBrand}>Listes</Text>
        <ActivityIndicator color={colors.now} size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  if (!auth.configured) {
    return (
      <ListsProvider userId="local">
        <AppNavigator />
      </ListsProvider>
    );
  }

  if (!auth.user) {
    return (
      <>
        <AuthScreen />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <ListsProvider userId={auth.user.id}>
      <AppNavigator />
    </ListsProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 16,
  },
  bootBrand: {
    fontFamily: fonts.displayBold,
    fontSize: 36,
    color: colors.foreground,
    letterSpacing: -1,
  },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    fontSize: 13,
  },
});
