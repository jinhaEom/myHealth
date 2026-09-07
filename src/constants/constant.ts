import { Platform } from 'react-native';

export const SCROLL_BOTTOM = 'pb-[24px] ios:pb-[74px] android:pb-[104px]';
export const WEEKDAY = ['월', '화', '수', '목', '금', '토', '일'];
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
