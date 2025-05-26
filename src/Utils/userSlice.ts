import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const res = await axios.get('https://www.mannamdeliveries.link/user', {
    withCredentials: true,
  });
  return res.data;
});

export interface UserState {
  userId: number;
  socialType: string;
  nickname: string;
  gender: string;
  latitude: number;
  longitude: number;
  age: number;
  personalities: string;
  interests: string;
  footprint: number;
  question: string;
  questionList: string;
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
