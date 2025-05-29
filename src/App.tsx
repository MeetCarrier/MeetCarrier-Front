import MainPage from "./pages/Main";
import Layout from "./components/Layout";
import MeetCenter from "./pages/MeetCenter";
import Hobby from "./pages/Hobby";
import SurveyQ from "./pages/SurveyQ";
import RangeSetting from "./pages/RangeSetting";
import ChatListPage from "./pages/Chat/ChatListPage";
import SurveyPage from "./pages/Chat/SurveyPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/Chat/ChatPage";
import Calendar from "./pages/Calendar/Calendar";
import Dairy from "./pages/Calendar/Diary";
import Stamp from "./pages/Calendar/Stamp";
import Profile from "./pages/Profile/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Utils/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
            <Route path="Calendar" element={<Calendar />} />
            <Route path="Diary" element={<Dairy />} />
            <Route path="Stamp" element={<Stamp />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
