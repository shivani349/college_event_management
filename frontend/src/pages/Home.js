import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllEvents();
        
        // Filter for upcoming events (events with dates in the future)
        const now = new Date();
        const upcoming = response.data.filter(event => new Date(event.date) >= now);
        
        // Sort by date (closest first)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Set featured event (first upcoming event)
        if (upcoming.length > 0) {
          setFeaturedEvent(upcoming[0]);
          // Take the next 3 events for the upcoming section
          setUpcomingEvents(upcoming.slice(1, 4));
        } else {
          setUpcomingEvents([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load upcoming events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Campus Events Made Simple</h1>
              <p className="lead fs-4 mb-4">
                Discover, register, and participate in college events all in one place.
                Never miss an opportunity to connect, learn, and grow.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/events" className="btn btn-light btn-lg px-4 me-md-2">
                  Browse Events
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="College Event" 
                className="img-fluid rounded shadow-lg" 
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Why Use Our Platform?</h2>
            <p className="lead text-muted">Streamlined event management for the entire campus community</p>
          </div>
          
          <div className="row g-4 py-3">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white mb-3 mx-auto" 
                       style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-calendar-check fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold">Easy Registration</h3>
                  <p className="text-muted">
                    Register for events with just a few clicks and receive your QR code instantly.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white mb-3 mx-auto" 
                       style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-qr-code fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold">QR Code Attendance</h3>
                  <p className="text-muted">
                    Skip the lines with quick QR code scanning for event check-ins.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white mb-3 mx-auto" 
                       style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-graph-up fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold">Real-time Updates</h3>
                  <p className="text-muted">
                    Get real-time updates on event capacity, changes, and important announcements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Event Section */}
      {featuredEvent && !loading && !error && (
        <div className="py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="position-relative">
                  <img 
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt={featuredEvent.title} 
                    className="img-fluid rounded shadow" 
                    style={{ height: '400px', width: '100%', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 start-0 bg-primary text-white p-3 rounded-end mt-4">
                    <h5 className="mb-0">Featured Event</h5>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Upcoming Events</h2>
            <p className="lead text-muted">Don't miss out on these exciting opportunities</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="alert alert-info text-center py-4">
              <h4 className="alert-heading">No upcoming events found</h4>
              <p>Check back soon for new events or create your own!</p>
              <Link to="/events/create" className="btn btn-primary mt-3">Create Event</Link>
            </div>
          ) : (
            <div className="row g-4">
              {upcomingEvents.map(event => (
                <div className="col-md-4" key={event._id}>
                  <div className="card h-100 border-0 shadow-sm hover-card">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-primary">{new Date(event.date).toLocaleDateString()}</span>
                        <span className="badge bg-secondary">{event.time}</span>
                      </div>
                      <h3 className="card-title h5 fw-bold mb-3">{event.title}</h3>
                      <p className="card-text text-muted mb-3">
                        {event.description.substring(0, 100)}...
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i> {event.location}
                        </small>
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
                      <Link to={`/events/${event._id}`} className="btn btn-outline-primary w-100">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-5">
            <Link to="/events" className="btn btn-primary btn-lg px-4">
              View All Events
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead fs-4 mb-4">
                Join our platform today to discover events, connect with peers, and make the most of your college experience.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Link to="/register" className="btn btn-light btn-lg px-4 me-sm-3">
                  Sign Up Now
                </Link>
                <Link to="/events" className="btn btn-outline-light btn-lg px-4">
                  Explore Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for hover effects */}
      <style jsx="true">{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;