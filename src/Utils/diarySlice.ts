import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DiaryState {
  journalId: number | null;
  text: string; // textarea에 쓴거 저장
  selectedStamp: number | null; // stamp 저장
  readOnlyText: string; // 예전에 쓴 일기 글 저장
  isReadOnly: boolean; // 예전에 쓴 일기는 수정 불가능
  isEditingToday: boolean; // 오늘 이미 등록된 일기가 있다면?
  dateLabel: string;
}

const initialState: DiaryState = {
  journalId: null,
  text: '',
  selectedStamp: null,
  readOnlyText: '',
  isReadOnly: false,
  isEditingToday: false,
  dateLabel: '',
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setJournalId: (state, action: PayloadAction<number | null>) => {
      state.journalId = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setSelectedStamp: (state, action: PayloadAction<number | null>) => {
      state.selectedStamp = action.payload;
    },
    setReadOnlyText: (state, action: PayloadAction<string>) => {
      state.readOnlyText = action.payload;
    },
    setIsReadOnly: (state, action: PayloadAction<boolean>) => {
      state.isReadOnly = action.payload;
    },
    setIsEditingToday: (state, action: PayloadAction<boolean>) => {
      state.isEditingToday = action.payload;
    },
    setDateLabel: (state, action: PayloadAction<string>) => {
      state.dateLabel = action.payload;
    },
    resetDiary: () => initialState,
  },
});

export const {
  setJournalId,
  setText,
  setSelectedStamp,
  setReadOnlyText,
  setIsReadOnly,
  setIsEditingToday,
  setDateLabel,
  resetDiary,
} = diarySlice.actions;
export default diarySlice.reducer;
