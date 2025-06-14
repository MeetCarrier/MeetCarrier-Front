import MainPage from './pages/Main';
import Layout from './components/Layout';
import MeetCenter from './pages/MeetCenter';
import Hobby from './pages/Hobby';
import SurveyQ from './pages/SurveyQ';
import RangeSetting from './pages/RangeSetting';
import ChatListPage from './pages/Chat/ChatListPage';
import SurveyPage from './pages/Chat/SurveyPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/Chat/ChatPage';
import Calendar from './pages/Calendar/Calendar';
import Dairy from './pages/Calendar/Diary';
import ViewDiary from './pages/Calendar/ViewDiary';
import Stamp from './pages/Calendar/Stamp';
import Profile from './pages/Profile/ProfilePage';
import SelfEvaluation from './pages/SelfEvaluation';
import Test from './pages/Test/Test';
import TestResult from './pages/Test/TestResult';
import ReviewPage from './pages/Review/Review';
// import NotFoundPage from './pages/NotFoundPage';
import AlarmPage from './pages/AlarmPage';
import InviteWritePage from './pages/Chat/Invite/InviteWritePage';
import MeetingSchedulePage from './pages/MeetingSchedule/MeetingSchedulePage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import PsychTestResult from './pages/Profile/PsychTestResult';

import MatchResultWatcher from './components/MatchResultWatcher';

import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Utils/store';
import axios from 'axios';

// 로그인 토큰 만료되면 Login 페이지로 이동
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      //세션 토큰 만료 되면
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MatchResultWatcher />
                  <Layout />
                </>
              }
            >
              <Route index element={<Navigate to="/main" replace />} />
              <Route path="main" element={<MainPage />} />
              <Route path="Hobby" element={<Hobby />} />
              <Route path="SurveyQuestion" element={<SurveyQ />} />
              <Route path="MeetCenter" element={<MeetCenter />} />
              <Route path="RangeSetting" element={<RangeSetting />} />
              <Route path="ChatList" element={<ChatListPage />} />
              <Route path="survey/:surveyId" element={<SurveyPage />} />
              <Route path="Login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="chat/:chatId" element={<ChatPage />} />
              <Route path="invite-write" element={<InviteWritePage />} />
              <Route path="Calendar" element={<Calendar />} />
              <Route path="Diary" element={<Dairy />} />
              <Route path="ViewDiary" element={<ViewDiary />} />
              <Route path="Stamp" element={<Stamp />} />
              <Route path="Profile" element={<Profile />} />
              <Route path="SelfEvaluation" element={<SelfEvaluation />} />
              <Route path="Test" element={<Test />} />
              <Route path="TestResult" element={<TestResult />} />
              <Route path="Alarm" element={<AlarmPage />} />
              <Route
                path="meeting-schedule"
                element={<MeetingSchedulePage />}
              />
              <Route path="review" element={<ReviewPage />} />
              <Route path="Profile/edit" element={<ProfileEditPage />} />
              <Route path="PsychTestResult" element={<PsychTestResult />} />

              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
