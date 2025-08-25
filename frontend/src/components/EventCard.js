import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { registrationService } from '../services/api';

const EventCard = ({ event }) => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get registration count
  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await registrationService.getRegistrationCount(event._id);
        setRegistrationCount(response.data.count);
      } catch (error) {
        console.error('Error fetching registration count:', error);
      }
    };

    getCount();
  }, [event._id]);

  // Check if user is the organizer
  const isOrganizer = isAuthenticated && currentUser?._id === event.organizer?._id;

  // Check if user is admin
  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  return (
    <div className="card mb-4">
      <div className="card-body">
        <img src={`http://localhost:5000${event.poster?.fileUrl}`} alt={event.title} className="card-img-top" />
        <h5 className="card-title">{event.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {formatDate(event.date)} at {event.time}
        </h6>
        <p className="card-text">{event.description}</p>
        <p className="card-text">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="card-text">
          <strong>Organizer:</strong> {event.organizer.name}
        </p>
        <p className="card-text">
          <strong>Registrations:</strong> {registrationCount} / {event.capacity}
        </p>
        
        <div className="d-flex justify-content-between">
          
          <Link to={`/events/${event._id}`} className="btn btn-primary">
            View Details....
          </Link>
          
          {(isOrganizer || isAdmin) && (
            <div>
              <Link to={`/events/edit/${event._id}`} className="btn btn-warning me-2">
                Edit
              </Link>
              <Link to={`/events/${event._id}/manage`} className="btn btn-info">
                Manage
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;