import { AlertModal } from '@/components/AlertModal';
import { Colors } from '@/constants/colors';
import { BodyPart } from '@/lib/types';
import { useAdsStore } from '@/store/useAdsStore';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Toast from 'react-native-simple-toast';
import { useSettings } from './hooks/useSettings';

export default function SettingScreen() {
  const {
    insets,
    parts,
    addPart,
    setPartActive,
    setParts,
    resetAll,
    newName,
    setNewName,
    logout,
    goal,
    goalCountInput,
    setGoalCountInput,
    goalRecurring,
    setGoalRecurring,
    saveGoal,
    duplicateAlertVisible,
    setDuplicateAlertVisible,
    invalidGoalAlertVisible,
    setInvalidGoalAlertVisible,
    resetConfirmVisible,
    setResetConfirmVisible,
    deleteTargetId,
    requestDeletePart,
    cancelDeletePart,
    confirmDeletePart,
    cycle,
    cycleSteps,
    addCycleStep,
    removeCycleStep,
    toggleCycleStepPart,
    moveCycleStep,
    saveCycle,
    invalidCycleAlertVisible,
    setInvalidCycleAlertVisible,
  } = useSettings();

  const adsRemoved = useAdsStore((s) => s.adsRemoved);
  const purchasing = useAdsStore((s) => s.purchasing);
  const purchaseRemoveAds = useAdsStore((s) => s.purchaseRemoveAds);
  const restorePurchases = useAdsStore((s) => s.restorePurchases);

  const [editMode, setEditMode] = useState(false);

  const onAdd = () => {
    const name = newName.trim();
    if (!name) return;
    if (!addPart(name)) setDuplicateAlertVisible(true);
    else setNewName('');
  };

  const onSaveGoal = () => {
    Toast.show("저장되었어요.", Toast.SHORT);
    if (!saveGoal()) setInvalidGoalAlertVisible(true);
  };

  const onSaveCycle = () => {
    if (!saveCycle()) {
      setInvalidCycleAlertVisible(true);
      return;
    }
    Toast.show('저장되었어요.', Toast.SHORT);
  };

  const onLogout = async () => {
    await logout();
    Toast.show('로그아웃됐어요', Toast.SHORT);
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }}>
      <NestableScrollContainer
        contentContainerClassName="px-[16px] pb-[24px] ios:pb-[74px] android:pb-[104px]"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mt-[8px] text-[26px] font-medium text-fg">설정</Text>


        <View className="mb-[8px] mt-[24px] flex-row items-center justify-between">
          <Text className="text-[13px] text-sub">부위 관리</Text>
          <TouchableOpacity onPress={() => setEditMode((v) => !v)} hitSlop={8} className="p-[4px]">
            <Ionicons name={editMode ? 'checkmark' : 'pencil'} size={16} color={Colors.gray2Color} />
          </TouchableOpacity>
        </View>
        <View className="rounded-[16px] bg-card p-[16px]">
          <NestableDraggableFlatList
            data={parts}
            onDragEnd={({ data }) => setParts(data)}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag, isActive, getIndex }: RenderItemParams<BodyPart>) => {
              const index = getIndex?.() ?? 0;
              return (
                <ScaleDecorator>
                  <View
                    className={`flex-row items-center gap-[10px] py-[6px] ${index > 0 ? 'mt-[4px]' : ''
                      } ${isActive ? 'opacity-70' : ''}`}
                  >
                    <TouchableOpacity
                      onPressIn={drag}
                      disabled={isActive}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      className="p-[4px]"
                    >
                      <Ionicons name="reorder-two" size={20} color={Colors.gray2Color} />
                    </TouchableOpacity>

                    <Text className={`flex-1 text-[15px] ${item.isActive ? 'text-fg' : 'text-dim line-through'}`}>
                      {item.name}
                    </Text>

                    {editMode ? (
                      <TouchableOpacity onPress={() => requestDeletePart(item.id)} hitSlop={8}>
                        <View className=" rounded-lg bg-red-600 py-[6px] px-[10px]">
                          <Text className="text-[12px] font-bold text-white">삭제</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <Switch
                        value={item.isActive}
                        onValueChange={(v) => setPartActive(item.id, v)}
                        trackColor={{ false: Colors.gray1Color, true: Colors.mainColor }}
                        thumbColor={Colors.whiteColor}
                      />
                    )}
                  </View>
                </ScaleDecorator>
              );
            }}
          />
          <View className="mt-[12px] flex-row items-center gap-[10px]">
            <TextInput
              className="flex-1 rounded-[8px] bg-bg px-[10px] py-[8px] text-[15px] text-fg"
              value={newName}
              onChangeText={setNewName}
              placeholder="새 부위 추가"
              placeholderTextColor={Colors.disabledColor}
              onSubmitEditing={onAdd}
              returnKeyType="done"
            />
            <Pressable onPress={onAdd} hitSlop={8}>
              <Text className="text-[15px] font-medium text-fg">추가</Text>
            </Pressable>
          </View>
          <Text className="mt-[12px] text-[12px] text-dim">
            끄면 기록 화면에서 숨겨져요. 과거 기록은 유지돼요.
          </Text>
        </View>

        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">계정</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] text-dim">로그인 계정</Text>
            <Text className="text-[13px] text-sub">구글 · Apple TODO</Text>
          </View>
        </View>
        <View className="rounded-[16px] bg-card p-[16px] mt-[12px]">

          <TouchableOpacity onPress={onLogout} className="flex-row items-center justify-between ">
            <Text className="text-[15px] text-dim">로그아웃</Text>
          </TouchableOpacity>
        </View>
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">광고</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          {adsRemoved ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-[15px] text-fg">광고가 제거됐어요</Text>
              <Ionicons name="checkmark-circle" size={18} color={Colors.mainColor} />
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={purchaseRemoveAds}
                disabled={purchasing}
                className="flex-row items-center justify-between"
              >
                <Text className="text-[15px] text-fg">광고 제거</Text>
                {purchasing ? (
                  <ActivityIndicator size="small" color={Colors.gray2Color} />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={Colors.gray2Color} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={restorePurchases} className="mt-[12px]">
                <Text className="text-[13px] text-sub">구매 복원</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* ── 앱 정보 ── */}
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">앱 정보</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] text-fg">버전</Text>
            <Text className="text-[13px] text-sub">{'1.0.0'}</Text>
          </View>
        </View>
      </NestableScrollContainer>

      <AlertModal
        visible={duplicateAlertVisible}
        title="이미 있는 부위예요"
        contents="다른 이름을 입력해 주세요"
        okLabel="확인"
        onOk={() => setDuplicateAlertVisible(false)}
      />
      <AlertModal
        visible={invalidGoalAlertVisible}
        title="목표 횟수 오류"
        contents="1 이상의 숫자를 입력해 주세요"
        okLabel="확인"
        onOk={() => setInvalidGoalAlertVisible(false)}
      />
      <AlertModal
        visible={invalidCycleAlertVisible}
        title="싸이클 단계 오류"
        contents="모든 단계에 부위를 하나 이상 선택해 주세요"
        okLabel="확인"
        onOk={() => setInvalidCycleAlertVisible(false)}
      />
      <AlertModal
        visible={!!deleteTargetId}
        title="부위 삭제"
        contents="목록에서 사라지고 지난 기록은 그대로 남아요. 같은 이름으로 다시 추가하면 되살릴 수 있어요."
        okLabel="삭제"
        cancelLabel="취소"
        danger
        onOk={confirmDeletePart}
        onCancel={cancelDeletePart}
      />
      <AlertModal
        visible={resetConfirmVisible}
        title="데이터 초기화"
        contents="모든 기록과 부위 설정이 삭제돼요. 되돌릴 수 없어요."
        okLabel="초기화"
        cancelLabel="취소"
        danger
        onOk={() => {
          setResetConfirmVisible(false);
          resetAll();
        }}
        onCancel={() => setResetConfirmVisible(false)}
      />
    </View>
  );
}
