import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import EmploymentPage from './pages/EmploymentPage';
import HomePage from './pages/HomePage';
import PopulationDashboard from './pages/PopulationDashboard';
import './i18n';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/population" element={<PopulationDashboard />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="employment" element={<EmploymentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
