import { Segmented } from '@/components/Segmented';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeatmapView from './components/HeatmapView';
import MonthView from './components/MonthView';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState(0);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-[16px]">
        <Segmented options={['캘린더', '히트맵']} value={mode} onChange={setMode} />
      </View>
      {mode === 0 ? <MonthView /> : <HeatmapView />}
    </View>
  );
}



