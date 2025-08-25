import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';
import AuthContext from '../context/AuthContext';
import QRCodeDisplay from '../components/QRCodeDisplay';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const eventResponse = await eventService.getEventById(id);
        setEvent(eventResponse.data);
        
        // Fetch registration count
        const countResponse = await registrationService.getRegistrationCount(id);
        setRegistrationCount(countResponse.data.count);
        
        // If user is logged in, check if they're registered
        if (isAuthenticated) {
          try {
            const userRegistrations = await registrationService.getUserRegistrations();
            const existingRegistration = userRegistrations.data.find(
              reg => reg.event._id === id
            );
            
            if (existingRegistration) {
              setRegistration(existingRegistration);
            }
          } catch (err) {
            console.error('Error checking registration:', err);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, isAuthenticated]);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle registration
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setRegistering(true);
      const response = await registrationService.registerForEvent(id);
      setRegistration(response.data);
      
      // Update registration count
      const countResponse = await registrationService.getRegistrationCount(id);
      setRegistrationCount(countResponse.data.count);
    } catch (err) {
      console.error('Error registering for event:', err);
      setError('Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  // Check if event is at capacity
  const isEventFull = event && registrationCount >= event.capacity;
  
  // Check if user is the organizer
  const isOrganizer = isAuthenticated && event && currentUser?._id === event.organizer._id;
  
  // Check if user is admin
  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Event not found</div>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
        <img src={`http://localhost:5000${event.poster?.fileUrl}`} alt={event.title} className="card-img-top" />

          <h1>{event.title}</h1>
          
          <div className="mb-4">
            <span className="badge bg-primary me-2">
              {formatDate(event.date)}
            </span>
            <span className="badge bg-secondary me-2">
              {event.time}
            </span>
            <span className="badge bg-info">
              {event.location}
            </span>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Description</h5>
              <p className="card-text">{event.description}</p>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Event Details</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Organizer:</strong> {event.organizer.name}
                </li>
                <li className="list-group-item">
                  <strong>Date:</strong> {formatDate(event.date)}
                </li>
                <li className="list-group-item">
                  <strong>Time:</strong> {event.time}
                </li>
                <li className="list-group-item">
                  <strong>Location:</strong> {event.location}
                </li>
                <li className="list-group-item">
                  <strong>Capacity:</strong> {registrationCount} / {event.capacity}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="d-flex justify-content-between mb-4">
            <Link to="/events" className="btn btn-outline-secondary">
              Back to Events
            </Link>
            
            {(isOrganizer || isAdmin) && (
              <div>
                <Link to={`/events/edit/${event._id}`} className="btn btn-warning me-2">
                  Edit Event
                </Link>
                <Link to={`/events/${event._id}/manage`} className="btn btn-info">
                  Manage Event
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-lg-4">
          {registration ? (
            <div className="mb-4">
              <div className="alert alert-success">
                You are registered for this event!
              </div>
              <QRCodeDisplay 
                qrCode={registration.qrCode} 
                eventTitle={event.title} 
              />
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Registration</h5>
                
                {isEventFull ? (
                  <div className="alert alert-warning">
                    This event is at full capacity
                  </div>
                ) : (
                  <>
                    <p className="card-text">
                      Register to attend this event and receive your QR code.
                    </p>
                    <button 
                      className="btn btn-primary w-100" 
                      onClick={handleRegister}
                      disabled={registering || !isAuthenticated}
                    >
                      {registering ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : isAuthenticated ? 'Register Now' : 'Login to Register'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Registration Status</h5>
              <div className="progress mb-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${(registrationCount / event.capacity) * 100}%` }}
                  aria-valuenow={registrationCount} 
                  aria-valuemin="0" 
                  aria-valuemax={event.capacity}
                >
                  {registrationCount}/{event.capacity}
                </div>
              </div>
              <p className="card-text">
                {event.capacity - registrationCount} spots remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;