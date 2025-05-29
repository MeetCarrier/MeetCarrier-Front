import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DiaryState {
  journalId: number | null;
  text: string; // textarea에 쓴거 저장
  selectedStamp: number | null; // stamp 저장
  isEditingToday: boolean; // 오늘 이미 등록된 일기가 있다면?
  dateLabel: string;
}

const initialState: DiaryState = {
  journalId: null,
  text: '',
  selectedStamp: null,
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
  setIsEditingToday,
  setDateLabel,
  resetDiary,
} = diarySlice.actions;
export default diarySlice.reducer;
