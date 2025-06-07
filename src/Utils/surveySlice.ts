import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SurveyState {
  surveys: {
    [sessionId: string]: {
      isSubmitted: boolean;
      isOtherSubmitted: boolean;
      hasJoinedChat: boolean;
      answers: { [questionId: number]: string };
    };
  };
}

const initialState: SurveyState = {
  surveys: {},
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setSurveyState: (
      state,
      action: PayloadAction<{
        sessionId: string;
        isSubmitted: boolean;
        isOtherSubmitted: boolean;
        hasJoinedChat: boolean;
        answers: { [questionId: number]: string };
      }>
    ) => {
      state.surveys[action.payload.sessionId] = {
        isSubmitted: action.payload.isSubmitted,
        isOtherSubmitted: action.payload.isOtherSubmitted,
        hasJoinedChat: action.payload.hasJoinedChat,
        answers: action.payload.answers,
      };
    },
    updateSurveyAnswers: (
      state,
      action: PayloadAction<{
        sessionId: string;
        answers: { [questionId: number]: string };
      }>
    ) => {
      if (state.surveys[action.payload.sessionId]) {
        state.surveys[action.payload.sessionId].answers =
          action.payload.answers;
      }
    },
    setSubmitted: (
      state,
      action: PayloadAction<{
        sessionId: string;
        isSubmitted: boolean;
      }>
    ) => {
      if (state.surveys[action.payload.sessionId]) {
        state.surveys[action.payload.sessionId].isSubmitted =
          action.payload.isSubmitted;
      }
    },
    setOtherSubmitted: (
      state,
      action: PayloadAction<{
        sessionId: string;
        isOtherSubmitted: boolean;
      }>
    ) => {
      if (state.surveys[action.payload.sessionId]) {
        state.surveys[action.payload.sessionId].isOtherSubmitted =
          action.payload.isOtherSubmitted;
      }
    },
    setHasJoinedChat: (
      state,
      action: PayloadAction<{
        sessionId: string;
        hasJoinedChat: boolean;
      }>
    ) => {
      if (state.surveys[action.payload.sessionId]) {
        state.surveys[action.payload.sessionId].hasJoinedChat =
          action.payload.hasJoinedChat;
      }
    },
  },
});

export const {
  setSurveyState,
  updateSurveyAnswers,
  setSubmitted,
  setOtherSubmitted,
  setHasJoinedChat,
} = surveySlice.actions;

export default surveySlice.reducer;
