import MainPage from './pages/Main';
import Layout from './components/Layout';
import MeetCenter from './pages/MeetCenter';
import Hobby from './pages/Hobby';
import SurveyQ from './pages/SurveyQ';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Utils/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="Hobby" element={<Hobby />} />
            <Route path="SurveyQuestion" element={<SurveyQ />} />
            <Route path="MeetCenter" element={<MeetCenter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
