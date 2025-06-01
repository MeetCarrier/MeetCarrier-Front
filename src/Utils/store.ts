import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import diaryReducer from './diarySlice';
import testReducer from './testSlice';
import selfTestReducer from './selfTestSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    diary: diaryReducer,
    test: testReducer,
    selfTest: selfTestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
