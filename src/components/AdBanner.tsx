import { useAdsStore } from '@/store/useAdsStore';
import { Platform, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// TODO: AdMob 콘솔에서 실제 광고 단위를 만든 뒤 프로덕션 ID로 교체
const PROD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  default: TestIds.BANNER,
});

const BANNER_UNIT_ID = __DEV__ ? TestIds.BANNER : PROD_UNIT_ID;

/** 광고 제거 구매가 없는 사용자에게만 화면 하단에 배너를 띄운다 */
export function AdBanner() {
  const adsRemoved = useAdsStore((s) => s.adsRemoved);
  if (adsRemoved) return null;

  return (
    <View className="items-center bg-bg">
      <BannerAd unitId={BANNER_UNIT_ID} size={BannerAdSize.BANNER} />
    </View>
  );
}
