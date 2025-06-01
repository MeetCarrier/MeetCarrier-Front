// store/selfTestSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface SelfTestResult {
  depressionScore: number;
  efficacyScore: number;
  relationshipScore: number;
  createdAt: string;
}

export const fetchSelfTestList = createAsyncThunk(
  'selfTest/fetchSelfTestList',
  async () => {
    const res = await axios.get<SelfTestResult[]>(
      'https://www.mannamdeliveries.link/api/test',
      { withCredentials: true }
    );

    return res.data; // 전체 리스트 반환
  }
);

interface SelfTestState {
  list: SelfTestResult[];
}

const initialState: SelfTestState = {
  list: [],
};

const selfTestSlice = createSlice({
  name: 'selfTest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSelfTestList.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default selfTestSlice.reducer;
