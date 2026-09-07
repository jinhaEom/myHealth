import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

interface Props {
  /** 1~5 */
  value: number;
  onChange: (v: number) => void;
  /** 각 단계에 보여줄 문자. 없으면 숫자 (강도), 이모지 배열이면 컨디션 */
  display?: string[];
  /** 선택된 단계 설명 라벨 */
  labels: string[];
}

export function ScaleSelector({ value, onChange, display, labels }: Props) {
  return (
    <View>
      <View className="flex-row gap-[8px]">
        {labels.map((_, i) => {
          const v = i + 1;
          const selected = v === value;
          return (
            <Pressable
              key={v}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChange(v);
              }}
              className={`flex-1 items-center rounded-[12px] border py-[12px] ${
                selected ? 'border-fg bg-fg' : 'border-line bg-card'
              }`}
            >
              <Text
                className={`text-[16px] ${selected ? 'font-medium text-on-accent' : 'font-normal text-sub'}`}
              >
                {display ? display[i] : v}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="mt-[8px] text-center text-[12px] text-sub">{labels[value - 1]}</Text>
    </View>
  );
}
