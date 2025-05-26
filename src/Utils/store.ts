import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import diaryReducer from './diarySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    diary: diaryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
