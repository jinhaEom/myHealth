import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function GlowIcon() {
  return (
    <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={120} style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={Colors.accent} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={Colors.accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="60" cy="60" r="60" fill="url(#glow)" />
      </Svg>

      <View style={{
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: Colors.accent,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="fitness" size={30} color={Colors.onAccent} />
      </View>
    </View>
  );
}