import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabRoute } from './src/components/TabRoute';
import { tabIconName } from './src/components/tabIcons';
import { ListsProvider, useLists } from './src/context/ListsContext';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.tabBar,
    text: colors.white,
    border: colors.tabBar,
    primary: colors.white,
  },
};

function AppNavigator() {
  const store = useLists();

  if (store.loading || !store.data) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootBrand}>Listes</Text>
        <ActivityIndicator color={colors.accent} size="large" />
        <StatusBar style="dark" />
      </View>
    );
  }

  const { tabs } = store.data;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      {store.error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{store.error}</Text>
        </View>
      ) : null}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        {tabs.map((tab) => (
          <Tab.Screen
            key={tab.id}
            name={tab.id}
            options={{
              title: tab.name,
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name={tabIconName(tab.icon)}
                  color={color}
                  size={size}
                />
              ),
            }}
          >
            {() => <TabRoute tabId={tab.id} />}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ListsProvider>
        <AppNavigator />
      </ListsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 16,
  },
  bootBrand: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -1,
  },
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopWidth: 0,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
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
