import MainPage from './pages/Main';
import Layout from './components/Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          {/* 다른 페이지도 여기에 추가 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
