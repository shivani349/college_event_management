import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CreateEvent from './pages/CreateEvent';
import ManageVolunteers from './pages/ManageVolunteers';


// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Organizer/Admin Routes */}
              <Route 
                path="/events/create" 
                element={
                  <ProtectedRoute roles={['organizer', 'admin']}>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/events/edit/:id" 
                element={
                  <ProtectedRoute roles={['organizer', 'admin']}>
                    <div className="container mt-4">
                      <h2>Edit Event</h2>
                      <p className="alert alert-info">
                        Event editing form will be implemented here.
                      </p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/events/:id/manage" 
                element={
                  <ProtectedRoute roles={['organizer', 'admin', 'volunteer']}>
                    <div className="container mt-4">
                      <h2>Manage Event</h2>
                      <p className="alert alert-info">
                        Event management dashboard will be implemented here.
                      </p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Volunteer Routes */}
              {/* <Route 
                path="/scan" 
                element={
                  <ProtectedRoute roles={['organizer', 'admin', 'volunteer']}>
                    <div className="container mt-4">
                      <h2>Scan QR Code</h2>
                      <p className="alert alert-info">
                        QR code scanner will be implemented here.
                      </p>
                    </div>
                  </ProtectedRoute>
                } 
              /> */}
              <Route 
                path="/volunteers/manage"
                element={
                  <ProtectedRoute roles={['organizer', 'admin']}>
                    <ManageVolunteers />
                  </ProtectedRoute>
                }
              />
              
              {/* Unauthorized */}
              <Route 
                path="/unauthorized" 
                element={
                  <div className="container mt-5">
                    <div className="alert alert-danger">
                      <h4>Unauthorized</h4>
                      <p>You don't have permission to access this page.</p>
                    </div>
                  </div>
                } 
              />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
