import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TestCategory = 'selfEfficacy' | 'interpersonalSkill' | 'depression';

interface TestState {
  answers: {
    [key in TestCategory]: {
      [questionId: number]: number;
    };
  };
}

const initialState: TestState = {
  answers: {
    selfEfficacy: {},
    interpersonalSkill: {},
    depression: {},
  },
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    saveAnswer: (
      state,
      action: PayloadAction<{
        category: TestCategory;
        questionId: number;
        score: number;
      }>
    ) => {
      const { category, questionId, score } = action.payload;
      state.answers[category][questionId] = score;
    },
    resetTest: () => initialState,
  },
});

export const { saveAnswer, resetTest } = testSlice.actions;
export default testSlice.reducer;
