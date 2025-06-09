import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MeetingScheduleState {
  matchId: number | null;
  receiverId: number | null;
  date: string | null;
  memo: string | null;
  location: string | null;
  isScheduled: boolean;
}

const initialState: MeetingScheduleState = {
  matchId: null,
  receiverId: null,
  date: null,
  memo: null,
  location: null,
  isScheduled: false,
};

const meetingScheduleSlice = createSlice({
  name: "meetingSchedule",
  initialState,
  reducers: {
    setMeetingSchedule: (
      state,
      action: PayloadAction<MeetingScheduleState>
    ) => {
      state.matchId = action.payload.matchId;
      state.receiverId = action.payload.receiverId;
      state.date = action.payload.date;
      state.memo = action.payload.memo;
      state.location = action.payload.location;
      state.isScheduled = action.payload.isScheduled;
    },
    clearMeetingSchedule: (state) => {
      state.matchId = null;
      state.receiverId = null;
      state.date = null;
      state.memo = null;
      state.location = null;
      state.isScheduled = false;
    },
  },
});

export const { setMeetingSchedule, clearMeetingSchedule } =
  meetingScheduleSlice.actions;
export default meetingScheduleSlice.reducer;
