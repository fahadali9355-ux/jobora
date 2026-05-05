import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import JobSeekerDashboard from './pages/JobSeekerDashboard.tsx';
import RecruiterDashboard from './pages/RecruiterDashboard.tsx';
import PostJobPage from './pages/PostJobPage.tsx';
import JobSearchPage from './pages/JobSearchPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/seeker" element={<JobSeekerDashboard />} />
        <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
