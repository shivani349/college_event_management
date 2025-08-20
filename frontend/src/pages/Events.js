import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';
import AuthContext from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllEvents();
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Check if user can create events
  const canCreateEvents = isAuthenticated && 
    (currentUser?.role === 'admin' || currentUser?.role === 'organizer');

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Events</h1>
        {canCreateEvents && (
          <Link to="/events/create" className="btn btn-success">
            Create New Event
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : events.length === 0 ? (
        <div className="alert alert-info">No events found</div>
      ) : (
        <div className="row">
          {events.map(event => (
            <div className="col-md-6 col-lg-4 mb-4" key={event._id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;