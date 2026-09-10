import GlowIcon from '@/components/GlowIcon';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const onLogin = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            Alert.alert('이메일과 비밀번호를 입력해 주세요');
            return;
        }
        setSubmitting(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password,
            });
            if (error) {
                Alert.alert('로그인 실패', error.message);
                return;
            }
            Toast.show("로그인 되었습니다.", Toast.SHORT)
            router.replace('/home');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-bg"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerClassName="flex-grow justify-center px-[24px]"
                contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-[36px] items-center">
                    <GlowIcon />
                    <Text className="text-[26px] font-semibold text-fg">My Health</Text>
                    <Text className="mt-[6px] text-[14px] text-sub">매일매일 운동기록하는 습관을 길러봐요</Text>
                </View>

                <View className="gap-[12px]">
                    <View className="flex-row items-center gap-[10px] rounded-[14px] bg-card px-[14px]">
                        <Ionicons name="mail-outline" size={18} color={Colors.disabledColor} />
                        <TextInput
                            className="h-[50px] flex-1 text-[15px] text-fg"
                            placeholder="이메일"
                            placeholderTextColor={Colors.disabledColor}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            returnKeyType="next"
                        />
                    </View>
                    <View className="flex-row items-center gap-[10px] rounded-[14px] bg-card px-[14px]">
                        <Ionicons name="lock-closed-outline" size={18} color={Colors.disabledColor} />
                        <TextInput
                            className="h-[50px] flex-1 text-[15px] text-fg"
                            placeholder="비밀번호"
                            placeholderTextColor={Colors.disabledColor}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            returnKeyType="done"
                            onSubmitEditing={onLogin}
                        />
                        <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={18}
                                color={Colors.disabledColor}
                            />
                        </Pressable>
                    </View>
                </View>

                <Pressable className="mt-[12px] self-end" hitSlop={8}>
                    <Text className="text-[13px] text-sub">비밀번호를 잊으셨나요?</Text>
                </Pressable>

                <Pressable
                    className="mt-[20px] h-[52px] items-center justify-center rounded-[14px] bg-accent"
                    onPress={onLogin}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={Colors.onAccent} />
                    ) : (
                        <Text className="text-[15px] font-semibold text-on-accent">로그인</Text>
                    )}
                </Pressable>

                <View className="my-[24px] flex-row items-center gap-[10px]">
                    <View className="h-[1px] flex-1 bg-line" />
                    <Text className="text-[12px] text-dim">또는</Text>
                    <View className="h-[1px] flex-1 bg-line" />
                </View>

                <SocialAuthButtons mode="login" onSuccess={() => router.replace('/home')} />

                <View className="mt-[28px] flex-row justify-center gap-[6px]">
                    <Text className="text-[13px] text-sub">계정이 없으신가요?</Text>
                    <Link href="/signup" replace asChild>
                        <Pressable hitSlop={8}>
                            <Text className="text-[13px] font-medium text-accent">회원가입</Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
