import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { FamilyProvider } from './context/FamilyContext';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import EditChild from './pages/EditChild';
import HealthRecords from './pages/HealthRecords';
import MediaCenter from './pages/MediaCenter';
import Support from './pages/Support';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorLogin from './pages/DoctorLogin';
import Chatbot from './pages/Chatbot';
import DailySchedule from './pages/DailySchedule';

import NutritionGuide from './pages/NutritionGuide';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import GameSpace from './pages/GameSpace';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'child' && location.pathname !== '/media' && location.pathname !== '/gamespace') {
    return <Navigate to="/media" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Global Floating Button Wrapper
const GlobalFloatingButton = () => {
  const { user } = React.useContext(AuthContext);
  if (user && user.role !== 'doctor') {
    return <FloatingAIAssistant />;
  }
  return null;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="babycare-theme">
      <AuthProvider>
        <FamilyProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground relative transition-colors duration-300">
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctor-login" element={<DoctorLogin />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['parent', 'support']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-child"
                  element={
                    <ProtectedRoute>
                      <AddChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-child/:childId"
                  element={
                    <ProtectedRoute>
                      <EditChild />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/child/:childId/health"
                  element={
                    <ProtectedRoute>
                      <HealthRecords />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/media"
                  element={
                    <ProtectedRoute>
                      <MediaCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gamespace"
                  element={
                    <ProtectedRoute>
                      <GameSpace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <ProtectedRoute>
                      <Support />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book-appointment"
                  element={
                    <ProtectedRoute>
                      <BookAppointment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chatbot />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/child/:childId/schedule"
                  element={
                    <ProtectedRoute>
                      <DailySchedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <DailySchedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutrition"
                  element={
                    <ProtectedRoute>
                      <NutritionGuide />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
              <GlobalFloatingButton />
            </div>
          </Router>
        </FamilyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
