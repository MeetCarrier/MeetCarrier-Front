import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import selfTestReducer from "./selfTestSlice";
import surveyReducer from "./surveySlice";
import { UserState } from "./userSlice";
import { SelfTestState } from "./selfTestSlice";
import { SurveyState } from "./surveySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    diary: diaryReducer,
    test: testReducer,
    selfTest: selfTestReducer,
    survey: surveyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
