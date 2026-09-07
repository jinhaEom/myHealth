import { Pressable, Text, View } from 'react-native';

interface Props {
  options: string[];
  value: number;
  onChange: (index: number) => void;
}

/** 상단 세그먼트 컨트롤 (캘린더/히트맵 전환 등) */
export function Segmented({ options, value, onChange }: Props) {
  return (
    <View className="flex-row rounded-[10px] bg-card p-[3px]">
      {options.map((opt, i) => (
        <Pressable
          key={opt}
          onPress={() => onChange(i)}
          className={`flex-1 items-center rounded-[8px] py-[7px] ${i === value ? 'bg-card-sel' : ''}`}
        >
          <Text
            className={`text-[13px] ${i === value ? 'font-medium text-fg' : 'font-normal text-sub'}`}
          >
            {opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
