import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import diaryReducer from "./diarySlice";
import testReducer from "./testSlice";
import selfTestReducer from "./selfTestSlice";
import surveyReducer from "./surveySlice";
import matchingReducer from "./matchingSlice";
import meetingScheduleReducer from "./meetingScheduleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    matching: matchingReducer,
    diary: diaryReducer,
    test: testReducer,
    selfTest: selfTestReducer,
    survey: surveyReducer,
    meetingSchedule: meetingScheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
