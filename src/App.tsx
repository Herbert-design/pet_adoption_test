import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from './pages/WelcomePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { SearchPage } from './pages/SearchPage';
import { AdoptPage } from './pages/AdoptPage';
import { PetDetailPage } from './pages/PetDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { ApplicationForm } from './pages/ApplicationForm';
import { LoginPage } from './pages/LoginPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth();
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RootRedirect() {
  const onboarded = localStorage.getItem('onboarded');
  if (!onboarded) {
    return <Navigate to="/welcome" replace />;
  }
  return <DiscoveryPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/adopt" element={<AdoptPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/pet/:id" element={<PetDetailPage />} />
          <Route path="/apply/:id" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          {/* Default to welcome if not visited before or just as entry */}
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
