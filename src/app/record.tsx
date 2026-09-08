import { AlertModal } from '@/components/AlertModal';
import { Chip } from '@/components/Chip';
import { ScaleSelector } from '@/components/ScaleSelector';
import { Colors } from '@/constants/colors';
import {
  CONDITION_EMOJI,
  CONDITION_LABELS,
  DURATION_DEFAULT,
  DURATION_MAX,
  DURATION_SLIDER_MAX,
  DURATION_STEP,
  INTENSITY_LABELS,
} from '@/constants/recovery';
import { formatKorean, todayStr } from '@/lib/date';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const logDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayStr();

  const parts = useWorkoutStore((s) => s.parts);
  const saveLog = useWorkoutStore((s) => s.saveLog);
  const addPart = useWorkoutStore((s) => s.addPart);
  const existing = useWorkoutStore((s) => s.logs.find((l) => l.logDate === logDate));

  // 비활성 부위여도 기존 기록에 포함돼 있으면 보여준다 (과거 기록 유지 원칙)
  const visibleParts = parts.filter((p) => p.isActive || existing?.partIds.includes(p.id));

  const [selected, setSelected] = React.useState<string[]>(existing?.partIds ?? []);
  const [duration, setDuration] = React.useState(existing?.durationMin ?? DURATION_DEFAULT);
  const [durationText, setDurationText] = React.useState(
    String(existing?.durationMin ?? DURATION_DEFAULT),
  );
  const [intensity, setIntensity] = React.useState(existing?.intensity ?? 3);
  const [condition, setCondition] = React.useState(existing?.condition ?? 3);
  const [memo, setMemo] = React.useState(existing?.memo ?? '');
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');

  const togglePart = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const applyDuration = (min: number) => {
    const v = Math.max(0, Math.min(DURATION_MAX, Math.round(min)));
    setDuration(v);
    setDurationText(String(v));
  };

  const onAddPart = () => {
    const name = newName.trim();
    if (!name) return;
    const id = addPart(name);
    if (!id) {
      <AlertModal
        visible={adding}
        title="이미 있는 부위예요"
        contents="이미 있는 부위예요"
        okLabel="확인"
        onOk={() => {
          setAdding(false);
        }}
      />
      return;
    }
    setSelected((prev) => [...prev, id]);
    setNewName('');
    setAdding(false);
  };

  const canSave = selected.length > 0 && duration > 0;

  const onSave = () => {
    saveLog({
      logDate,
      durationMin: duration,
      intensity,
      condition,
      memo: memo.trim() || null,
      partIds: selected,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        className="flex-1 bg-bg"
        style={{ paddingTop: Platform.OS === 'ios' ? 16 : insets.top + 8 }}
      >
        {/* 헤더 */}
        <View className="flex-row items-center justify-between px-[16px] pb-[8px]">
          <Text className="text-[17px] font-medium text-fg">
            {formatKorean(logDate)} {existing ? '수정' : '기록'}
          </Text>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="close" size={24} color={Colors.sub} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerClassName="px-[16px] pb-[24px]"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. 부위 */}
          <Text className="mb-[10px] mt-[22px] text-[13px] text-sub">부위</Text>
          <View className="flex-row flex-wrap gap-[8px]">
            {visibleParts.map((p) => (
              <Chip
                key={p.id}
                label={p.name}
                selected={selected.includes(p.id)}
                onPress={() => togglePart(p.id)}
              />
            ))}
            {!adding && <Chip label="＋" dashed onPress={() => setAdding(true)} />}
          </View>
          {adding && (
            <View className="mt-[12px] flex-row items-center gap-[14px]">
              <TextInput
                className="flex-1 rounded-[10px] bg-card px-[12px] py-[9px] text-[15px] text-fg"
                value={newName}
                onChangeText={setNewName}
                placeholder="새 부위 이름"
                placeholderTextColor={Colors.dim}
                autoFocus
                onSubmitEditing={onAddPart}
                returnKeyType="done"
              />
              <Pressable onPress={onAddPart} hitSlop={8}>
                <Text className="text-[15px] font-medium text-fg">추가</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAdding(false);
                  setNewName('');
                }}
                hitSlop={8}
              >
                <Text className="text-[15px] text-sub">취소</Text>
              </Pressable>
            </View>
          )}

          {/* 2. 총 시간 */}
          <Text className="mb-[10px] mt-[22px] text-[13px] text-sub">총 시간</Text>
          <View className="flex-row items-center gap-[12px]">
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={DURATION_STEP}
              maximumValue={DURATION_SLIDER_MAX}
              step={DURATION_STEP}
              value={Math.min(duration, DURATION_SLIDER_MAX)}
              onValueChange={applyDuration}
              minimumTrackTintColor={Colors.text}
              maximumTrackTintColor={Colors.line}
              thumbTintColor={Colors.text}
            />
            <View className="flex-row items-center gap-[4px]">
              <TextInput
                className="min-w-[52px] rounded-[10px] bg-card px-[10px] py-[8px] text-right text-[16px] text-fg"
                value={durationText}
                onChangeText={(t) => setDurationText(t.replace(/[^0-9]/g, ''))}
                onEndEditing={() => {
                  const n = parseInt(durationText, 10);
                  applyDuration(Number.isNaN(n) ? duration : n);
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text className="text-[15px] text-sub">분</Text>
            </View>
          </View>

          {/* 강도 */}
          <Text className="mb-[10px] mt-[22px] text-[13px] text-sub">강도</Text>
          <ScaleSelector value={intensity} onChange={setIntensity} labels={INTENSITY_LABELS} />

          {/* 컨디션 */}
          <Text className="mb-[10px] mt-[22px] text-[13px] text-sub">컨디션</Text>
          <ScaleSelector
            value={condition}
            onChange={setCondition}
            display={CONDITION_EMOJI}
            labels={CONDITION_LABELS}
          />

          {/* 5. 메모 (선택) */}
          <Text className="mb-[10px] mt-[22px] text-[13px] text-sub">메모</Text>
          <TextInput
            className="rounded-[12px] bg-card px-[14px] py-[12px] text-[15px] text-fg"
            value={memo}
            onChangeText={setMemo}
            placeholder="한 줄 메모 (선택)"
            placeholderTextColor={Colors.dim}
            returnKeyType="done"
          />
        </ScrollView>

        {/* 저장 */}
        <View className="px-[16px] pt-[8px]" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <Pressable
            className={`items-center rounded-[14px] py-[15px] ${canSave ? 'bg-accent' : 'bg-card'}`}
            disabled={!canSave}
            onPress={onSave}
          >
            <Text
              className={`text-[16px] font-medium ${canSave ? 'text-on-accent' : 'text-dim'}`}
            >
              {canSave ? '저장' : '부위를 선택하세요'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
