import MainPage from './pages/Main';
import Layout from './components/Layout';
import MeetCenter from './pages/MeetCenter';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="MeetCenter" element={<MeetCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
