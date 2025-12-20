import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { ExamPage } from './pages/ExamPage';
import { ResultPage } from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
