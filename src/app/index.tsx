import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color={Colors.mainColor} />
      </View>
    );
  }

  return <Redirect href={isLoggedIn ? '/home' : '/login'} />;
}
