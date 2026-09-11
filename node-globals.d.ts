/**
 * tsconfig의 customConditions: ["react-native"] 때문에 react-native-iap이 컴파일된 .d.ts 대신
 * 타입이 없는 원본 src/*.ts를 그대로 타입체크 대상으로 끌고 온다. 그 소스가 global을 참조해서 생기는
 * "Cannot find name 'global'" 에러를 막기 위한 최소 선언.
 */
declare var global: typeof globalThis;
