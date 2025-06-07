import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MatchingStatus = 'default' | 'matching' | 'success' | 'fail';

export interface MatchSuccessData {
  matchedUserId: number;
  finalScore: number;
  surveySessionId: number;
}

export interface MatchFailData {
  recommendedUserIds: number[];
  message: string;
}

interface MatchingState {
  status: MatchingStatus;
  isSocketConnected: boolean;
  successData?: MatchSuccessData;
  failData?: MatchFailData;
  timeoutId?: number;
}

const initialState: MatchingState = {
  status: 'default',
  isSocketConnected: false,
};

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<MatchingStatus>) => {
      state.status = action.payload;
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isSocketConnected = action.payload;
    },
    setSuccessData: (state, action: PayloadAction<MatchSuccessData>) => {
      state.successData = action.payload;
    },
    setFailData: (state, action: PayloadAction<MatchFailData>) => {
      state.failData = action.payload;
    },
    setMatchingTimeoutId: (state, action: PayloadAction<number>) => {
      state.timeoutId = action.payload;
    },
    clearMatchingTimeout: (state) => {
      clearTimeout(state.timeoutId);
      state.timeoutId = undefined;
    },

    resetMatching: () => initialState,
  },
});

export const {
  setStatus,
  setSocketConnected,
  setSuccessData,
  setFailData,
  resetMatching,
  setMatchingTimeoutId,
  clearMatchingTimeout,
} = matchingSlice.actions;
export default matchingSlice.reducer;
