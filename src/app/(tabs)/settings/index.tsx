import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
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
  } = useSettings()

  const onAdd = () => {
    const name = newName.trim();
    if (!name) return;
    if (!addPart(name)) Alert.alert('이미 있는 부위예요');
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
      Alert.alert('이미 있는 부위예요');
      return;
    }
    setEditingId(null);
  };

  const onReset = () => {
    Alert.alert('데이터 초기화', '모든 기록과 부위 설정이 삭제돼요. 되돌릴 수 없어요.', [
      { text: '취소', style: 'cancel' },
      { text: '초기화', style: 'destructive', onPress: resetAll },
    ]);
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
                {/* 맨위/맨아래에서 눌러도 moveBodyPart가 무시하므로 항상 활성으로 보여준다 */}
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
                trackColor={{ false: Colors.line, true: Colors.dim }}
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
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">계정</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] text-dim">로그인</Text>
            <Text className="text-[13px] text-sub">구글 · Apple TODO</Text>
          </View>
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
    </View>
  );
}
