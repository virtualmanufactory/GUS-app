import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DataPage from './pages/DataPage';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import UnitsPage from './pages/UnitsPage';
import VariablesPage from './pages/VariablesPage';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="variables" element={<VariablesPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="data/variable/:variableId" element={<DataPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
