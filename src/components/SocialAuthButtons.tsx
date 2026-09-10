import { Colors } from '@/constants/colors';
import { signInWithGoogle } from '@/lib/socialAuth';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

interface Props {
  mode: 'login' | 'signup';
  onSuccess: () => void;
}

export function SocialAuthButtons({ mode, onSuccess }: Props) {
  const [googleLoading, setGoogleLoading] = useState(false);

  const onGooglePress = async () => {
    setGoogleLoading(true);
    try {
      const session = await signInWithGoogle();
      if (session) onSuccess();
    } catch (e) {
      Alert.alert('Google 로그인 실패', e instanceof Error ? e.message : '잠시 후 다시 시도해 주세요');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View className="gap-[10px]">
      <Pressable
        className="h-[50px] flex-row items-center justify-center gap-[10px] rounded-[12px] bg-card"
        onPress={onGooglePress}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color={Colors.whiteColor} />
        ) : (
          <>
            <AntDesign name="google" size={18} color={Colors.whiteColor} />
            <Text className="text-[15px] font-medium text-fg">
              {mode === 'signup' ? 'Google로 가입하기' : 'Google로 계속하기'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
