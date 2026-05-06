import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';

import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminOverview from './pages/admin/AdminOverview.tsx';
import AdminUsers from './pages/admin/AdminUsers.tsx';
import AdminJobs from './pages/admin/AdminJobs.tsx';
import AdminAIModels from './pages/admin/AdminAIModels.tsx';
import AdminReports from './pages/admin/AdminReports.tsx';
import AdminSettings from './pages/admin/AdminSettings.tsx';

import RecruiterLayout from './pages/recruiter/RecruiterLayout.tsx';
import RecruiterOverview from './pages/recruiter/RecruiterOverview.tsx';
import CandidatesPage from './pages/recruiter/CandidatesPage.tsx';
import ATSPipelinePage from './pages/recruiter/ATSPipelinePage.tsx';
import AnalyticsPage from './pages/recruiter/AnalyticsPage.tsx';
import RecruiterSettings from './pages/recruiter/RecruiterSettings.tsx';
import PostJobPage from './pages/PostJobPage.tsx';

import SeekerLayout from './pages/seeker/SeekerLayout.tsx';
import SeekerOverview from './pages/seeker/SeekerOverview.tsx';
import MyApplicationsPage from './pages/seeker/MyApplicationsPage.tsx';
import ResumePage from './pages/seeker/ResumePage.tsx';
import ProfilePage from './pages/seeker/ProfilePage.tsx';
import NotificationsPage from './pages/seeker/NotificationsPage.tsx';
import JobSearchPage from './pages/JobSearchPage.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="ai-models" element={<AdminAIModels />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/dashboard/recruiter" element={<RecruiterLayout />}>
            <Route index element={<RecruiterOverview />} />
            <Route path="post-job" element={<PostJobPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="ats" element={<ATSPipelinePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<RecruiterSettings />} />
          </Route>

          <Route path="/dashboard/seeker" element={<SeekerLayout />}>
            <Route index element={<SeekerOverview />} />
            <Route path="applications" element={<MyApplicationsPage />} />
            <Route path="jobs" element={<JobSearchPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
