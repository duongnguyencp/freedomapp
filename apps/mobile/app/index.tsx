import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { colors } from '@/constants/theme';
import { useProfileStore } from '@/stores/profileStore';

// Gate screen: sends first-time users to onboarding, everyone else
// straight to the dashboard. Renders nothing but a spinner while the
// profile is being read from storage.
export default function Index() {
  const status = useProfileStore((state) => state.status);
  const profile = useProfileStore((state) => state.profile);
  const load = useProfileStore((state) => state.load);

  useEffect(() => {
    if (status === 'idle') {
      load();
    }
  }, [status, load]);

  if (status !== 'ready') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return <Redirect href={profile ? '/(tabs)' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
