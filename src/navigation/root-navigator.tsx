import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useAuth } from '@/core';
import type { ThemeType } from '@/core/hooks';
import { useIsFirstTime, useSelectedTheme } from '@/core/hooks';
import { Onboarding } from '@/screens';

import { AuthNavigator } from './auth-navigator';
import { NavigationContainer } from './navigation-container';
import { TabNavigator } from './tab-navigator';
const Stack = createNativeStackNavigator();

export const Root = () => {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const [theme, setSelectedTheme] = useSelectedTheme();
  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setSelectedTheme(theme as ThemeType);
      hideSplash();
    }
  }, [hideSplash, status, theme, setSelectedTheme]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
      }}
    >
      {isFirstTime ? (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      ) : (
        <Stack.Group>
          {status === 'signOut' ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="App" component={TabNavigator} />
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator = () => (
  <NavigationContainer>
    <Root />
  </NavigationContainer>
);
