// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const res = await axios.get('https://www.mannamdeliveries.link/user', {
    withCredentials: true,
  });
  return res.data;
});

export interface UserState {
  nickname: string;
  gender: string;
  region: string;
  interests: string;
  age: number;
  personalities: string;
  footprint: number;
  questions: string;
  imgUrl: string;
  maxAgeGap: number;
  allowOppositeGender: boolean;
  maxMatchingDistance: number;
}

const initialState: UserState | null = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export default userSlice.reducer;
