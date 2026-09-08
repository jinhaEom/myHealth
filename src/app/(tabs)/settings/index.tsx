import { AlertModal } from '@/components/AlertModal';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useSettings } from './hooks/useSettings';

export default function SettingScreen() {

  const {
    insets,
    parts,
    addPart,
    renamePart,
    setPartActive,
    movePart,
    resetAll,
    newName,
    setNewName,
    editingId,
    setEditingId,
    editName,
    setEditName,
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
  } = useSettings()

  const onAdd = () => {
    const name = newName.trim();
    if (!name) return;
    if (!addPart(name)) setDuplicateAlertVisible(true);
    else setNewName('');
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const name = editName.trim();
    if (name && !renamePart(editingId, name)) {
      setDuplicateAlertVisible(true);
      return;
    }
    setEditingId(null);
  };

  const onSaveGoal = () => {
    Toast.show("저장되었어요.", Toast.SHORT);
    if (!saveGoal()) setInvalidGoalAlertVisible(true);
  };

  const onLogout = async () => {
    await logout();
    Toast.show('로그아웃됐어요', Toast.SHORT);
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView
        contentContainerClassName="px-[16px] pb-[24px] ios:pb-[74px] android:pb-[104px]"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mt-[8px] text-[26px] font-medium text-fg">설정</Text>

        {/* TODO 드래그 기능 추가*/}
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">부위 관리</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          {parts.map((p, i) => (
            <View key={p.id} className={`flex-row items-center gap-[10px] ${i > 0 ? 'mt-[12px]' : ''}`}>
              <View className="gap-[2px]">
                <Pressable onPress={() => movePart(p.id, -1)}>
                  <Ionicons name="chevron-up" size={16} color={Colors.sub} />
                </Pressable>
                <Pressable onPress={() => movePart(p.id, 1)}>
                  <Ionicons name="chevron-down" size={16} color={Colors.sub} />
                </Pressable>
              </View>
              {editingId === p.id ? (
                <TextInput
                  className="flex-1 rounded-[8px] bg-bg px-[10px] py-[6px] text-[15px] text-fg"
                  value={editName}
                  onChangeText={setEditName}
                  autoFocus
                  onSubmitEditing={commitEdit}
                  onBlur={commitEdit}
                  returnKeyType="done"
                />
              ) : (
                <Pressable className="flex-1" onPress={() => startEdit(p.id, p.name)}>
                  <Text
                    className={`text-[15px] ${p.isActive ? 'text-fg' : 'text-dim line-through'}`}
                  >
                    {p.name}
                  </Text>
                </Pressable>
              )}
              <Switch
                value={p.isActive}
                onValueChange={(v) => setPartActive(p.id, v)}
                trackColor={{ false: Colors.line, true: Colors.accent }}
                thumbColor={Colors.text}
              />
            </View>
          ))}
          <View className="mt-[12px] flex-row items-center gap-[10px]">
            <TextInput
              className="flex-1 rounded-[8px] bg-bg px-[10px] py-[8px] text-[15px] text-fg"
              value={newName}
              onChangeText={setNewName}
              placeholder="새 부위 추가"
              placeholderTextColor={Colors.dim}
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
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">주간 목표</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          <View className="flex-row items-center gap-[10px]">
            <TextInput
              className="w-[64px] rounded-[8px] bg-bg px-[10px] py-[8px] text-center text-[15px] text-fg"
              value={goalCountInput}
              onChangeText={setGoalCountInput}
              placeholder="4"
              placeholderTextColor={Colors.dim}
              keyboardType="number-pad"
              returnKeyType="done"
            />
            <Text className="text-[15px] text-fg">회 / 주</Text>
            <View className="flex-1" />
            <Text className="text-[13px] text-sub">매주 반복</Text>
            <Switch
              value={goalRecurring}
              onValueChange={setGoalRecurring}
              trackColor={{ false: Colors.line, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
          <Pressable
            className="mt-[14px] items-center rounded-[10px] bg-bg py-[10px]"
            onPress={onSaveGoal}
          >
            <Text className="text-[14px] font-medium text-fg">저장</Text>
          </Pressable>
          {goal && (
            <Text className="mt-[10px] text-[12px] text-dim">
              {goal.recurring
                ? `현재 목표: 주 ${goal.targetCount}회 · 매주 반복`
                : `현재 목표: 이번 주 ${goal.targetCount}회 (반복 안 함)`}
            </Text>
          )}
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
        {/* ── 앱 정보 ── */}
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">앱 정보</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] text-fg">버전</Text>
            <Text className="text-[13px] text-sub">{'1.0.0'}</Text>
          </View>
        </View>
      </ScrollView>

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
