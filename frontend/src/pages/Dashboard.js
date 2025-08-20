import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import QRCodeDisplay from '../components/QRCodeDisplay';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const mockEvents = [
    {
      _id: '1',
      title: 'Annual Tech Symposium',
      date: '2023-12-15',
      time: '10:00 AM',
      location: 'Main Auditorium',
      description: 'Join us for a day of technology talks, workshops, and networking opportunities with industry professionals.',
      registrations: 145,
      capacity: 200,
      poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      _id: '2',
      title: 'Cultural Fest 2023',
      date: '2023-11-25',
      time: '5:00 PM',
      location: 'College Grounds',
      description: 'A celebration of diverse cultures through music, dance, art, and food. Come experience the vibrant traditions from around the world.',
      registrations: 320,
      capacity: 500,
      poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
    },
    {
      _id: '3',
      title: 'Career Fair 2023',
      date: '2023-12-05',
      time: '9:00 AM',
      location: 'College Gymnasium',
      description: 'Connect with top employers, explore internship and job opportunities, and attend career development workshops.',
      registrations: 210,
      capacity: 300,
      poster: 'https://images.unsplash.com/photo-1560523159-4a9692d222f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    }
  ];
  
  const mockRegistrations = [
    {
      _id: '101',
      event: {
        _id: '1',
        title: 'Annual Tech Symposium',
        date: '2023-12-15',
        time: '10:00 AM',
        location: 'Main Auditorium'
      },
      registrationDate: '2023-10-20',
      attended: false,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=reg-101'
    },
    {
      _id: '102',
      event: {
        _id: '2',
        title: 'Cultural Fest 2023',
        date: '2023-11-25',
        time: '5:00 PM',
        location: 'College Grounds'
      },
      registrationDate: '2023-10-15',
      attended: true,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=reg-102'
    }
  ];
  
  const mockVolunteerEvents = [
    {
      _id: '1',
      title: 'Annual Tech Symposium',
      date: '2023-12-15',
      time: '10:00 AM',
      location: 'Main Auditorium',
      role: 'Registration Desk',
      checkIns: 78,
      totalRegistrations: 145
    },
    {
      _id: '3',
      title: 'Career Fair 2023',
      date: '2023-12-05',
      time: '9:00 AM',
      location: 'College Gymnasium',
      role: 'Guide',
      checkIns: 45,
      totalRegistrations: 210
    }
  ];
  
  const mockStats = {
    totalEvents: 12,
    upcomingEvents: 5,
    totalRegistrations: 845,
    totalAttendees: 320,
    recentActivity: [
      { id: 1, type: 'registration', event: 'Annual Tech Symposium', time: '2 hours ago' },
      { id: 2, type: 'attendance', event: 'Cultural Fest 2023', time: '1 day ago' },
      { id: 3, type: 'event_created', event: 'Career Fair 2023', time: '3 days ago' }
    ]
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get role-specific stats
  const getRoleStats = () => {
    switch (currentUser.role) {
      case 'admin':
        return [
          { title: 'Total Events', value: mockStats.totalEvents, icon: 'bi-calendar-check', color: 'primary' },
          { title: 'Total Users', value: 450, icon: 'bi-people', color: 'success' },
          { title: 'Total Registrations', value: mockStats.totalRegistrations, icon: 'bi-person-check', color: 'info' },
          { title: 'Attendance Rate', value: '78%', icon: 'bi-graph-up', color: 'warning' }
        ];
      case 'organizer':
        return [
          { title: 'Your Events', value: mockEvents.length, icon: 'bi-calendar-check', color: 'primary' },
          { title: 'Total Registrations', value: mockEvents.reduce((sum, event) => sum + event.registrations, 0), icon: 'bi-person-check', color: 'success' },
          { title: 'Upcoming Events', value: mockStats.upcomingEvents, icon: 'bi-calendar-date', color: 'info' },
          { title: 'Attendance Rate', value: '82%', icon: 'bi-graph-up', color: 'warning' }
        ];
      case 'volunteer':
        return [
          { title: 'Assigned Events', value: mockVolunteerEvents.length, icon: 'bi-calendar-check', color: 'primary' },
          { title: 'Check-ins Processed', value: mockVolunteerEvents.reduce((sum, event) => sum + event.checkIns, 0), icon: 'bi-qr-code-scan', color: 'success' },
          { title: 'Next Event', value: formatDate(mockVolunteerEvents[0].date).split(',')[0], icon: 'bi-calendar-date', color: 'info' },
          { title: 'Completion Rate', value: '65%', icon: 'bi-graph-up', color: 'warning' }
        ];
      default: // participant
        return [
          { title: 'Registered Events', value: mockRegistrations.length, icon: 'bi-calendar-check', color: 'primary' },
          { title: 'Attended Events', value: mockRegistrations.filter(reg => reg.attended).length, icon: 'bi-person-check', color: 'success' },
          { title: 'Upcoming Events', value: mockRegistrations.filter(reg => new Date(reg.event.date) > new Date()).length, icon: 'bi-calendar-date', color: 'info' },
          { title: 'Available Events', value: mockStats.upcomingEvents, icon: 'bi-calendar-plus', color: 'warning' }
        ];
    }
  };

  // Render different dashboards based on user role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'organizer':
        return renderOrganizerDashboard();
      case 'volunteer':
        return renderVolunteerDashboard();
      default:
        return renderParticipantDashboard();
    }
  };

  // Admin dashboard
  const renderAdminDashboard = () => {
    return (
      <div className="fade-in">
        {/* Admin Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <i className="bi bi-calendar-event me-2"></i>Events
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people me-2"></i>Users
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <i className="bi bi-bar-chart me-2"></i>Reports
            </button>
          </li>
        </ul>

        {/* Admin Quick Actions */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/events/create" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>Create Event
                  </Link>
                  <Link to="/users/manage" className="btn btn-success">
                    <i className="bi bi-people me-2"></i>Manage Users
                  </Link>
                  <Link to="/events" className="btn btn-info text-white">
                    <i className="bi bi-calendar-check me-2"></i>Manage Events
                  </Link>
                  <Link to="/reports" className="btn btn-warning text-white">
                    <i className="bi bi-file-earmark-text me-2"></i>Generate Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="row mb-4">
          {getRoleStats().map((stat, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className={`bg-${stat.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </div>
                  <h3 className="display-6 fw-bold">{stat.value}</h3>
                  <p className="text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Recent Events</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Registrations</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockEvents.map(event => (
                        <tr key={event._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={event.poster} 
                                alt={event.title} 
                                className="rounded me-3" 
                                width="40" 
                                height="40" 
                                style={{ objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-0">{event.title}</h6>
                                <small className="text-muted">{event.location}</small>
                              </div>
                            </div>
                          </td>
                          <td>{new Date(event.date).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar bg-success" 
                                  role="progressbar" 
                                  style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                                  aria-valuenow={event.registrations} 
                                  aria-valuemin="0" 
                                  aria-valuemax={event.capacity}
                                ></div>
                              </div>
                              <span className="text-muted small">{event.registrations}/{event.capacity}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success">Active</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link to={`/events/${event._id}/manage`} className="btn btn-outline-primary">
                                <i className="bi bi-gear"></i>
                              </Link>
                              <Link to={`/events/edit/${event._id}`} className="btn btn-outline-secondary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white border-0 text-center">
                <Link to="/events" className="btn btn-sm btn-outline-primary">View All Events</Link>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Recent Activity</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {mockStats.recentActivity.map(activity => (
                    <li className="list-group-item px-4 py-3" key={activity.id}>
                      <div className="d-flex align-items-center">
                        <div className={`bg-${activity.type === 'registration' ? 'primary' : activity.type === 'attendance' ? 'success' : 'info'} text-white rounded-circle me-3 d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                          <i className={`bi ${activity.type === 'registration' ? 'bi-person-plus' : activity.type === 'attendance' ? 'bi-person-check' : 'bi-calendar-plus'} fs-5`}></i>
                        </div>
                        <div>
                          <h6 className="mb-0">
                            {activity.type === 'registration' ? 'New Registration' : 
                             activity.type === 'attendance' ? 'Attendance Marked' : 
                             'Event Created'}
                          </h6>
                          <p className="text-muted mb-0 small">
                            {activity.event} • {activity.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer bg-white border-0 text-center">
                <Link to="/activity" className="btn btn-sm btn-outline-primary">View All Activity</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Organizer dashboard
  const renderOrganizerDashboard = () => {
    return (
      <div className="fade-in">
        {/* Organizer Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <i className="bi bi-calendar-event me-2"></i>My Events
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'registrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              <i className="bi bi-person-check me-2"></i>Registrations
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="bi bi-bar-chart me-2"></i>Analytics
            </button>
          </li>
        </ul>

        {/* Organizer Quick Actions */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/events/create" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>Create New Event
                  </Link>
                  <Link to="/volunteers/manage" className="btn btn-success">
                    <i className="bi bi-people me-2"></i>Manage Volunteers
                  </Link>
                  <Link to="/events/templates" className="btn btn-info text-white">
                    <i className="bi bi-file-earmark-text me-2"></i>Event Templates
                  </Link>
                  <Link to="/events/reports" className="btn btn-warning text-white">
                    <i className="bi bi-graph-up me-2"></i>View Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizer Stats */}
        <div className="row mb-4">
          {getRoleStats().map((stat, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className={`bg-${stat.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </div>
                  <h3 className="display-6 fw-bold">{stat.value}</h3>
                  <p className="text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Your Events */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Your Events</h5>
                <Link to="/events/create" className="btn btn-sm btn-primary">
                  <i className="bi bi-plus-circle me-1"></i> Create Event
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="row g-0">
                  {mockEvents.map(event => (
                    <div className="col-md-4 border-end border-bottom p-4" key={event._id}>
                      <div className="d-flex flex-column h-100">
                        <div className="mb-3 position-relative">
                          <img 
                            src={event.poster} 
                            alt={event.title} 
                            className="rounded w-100" 
                            style={{ height: '160px', objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                        <h5 className="mb-2">{event.title}</h5>
                        <div className="mb-3 text-muted small">
                          <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-calendar me-2"></i>
                            {formatDate(event.date)}
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-clock me-2"></i>
                            {event.time}
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-geo-alt me-2"></i>
                            {event.location}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="text-muted small">Registrations</span>
                            <span className="text-muted small">{event.registrations}/{event.capacity}</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                              aria-valuenow={event.registrations} 
                              aria-valuemin="0" 
                              aria-valuemax={event.capacity}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="d-grid gap-2">
                            <Link to={`/events/${event._id}/manage`} className="btn btn-primary">
                              <i className="bi bi-gear me-2"></i>Manage
                            </Link>
                            <Link to={`/events/edit/${event._id}`} className="btn btn-outline-secondary">
                              <i className="bi bi-pencil me-2"></i>Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-footer bg-white border-0 text-center">
                <Link to="/events" className="btn btn-sm btn-outline-primary">View All Events</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Volunteer dashboard
  const renderVolunteerDashboard = () => {
    return (
      <div className="fade-in">
        {/* Volunteer Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              <i className="bi bi-calendar-event me-2"></i>My Assignments
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'scanner' ? 'active' : ''}`}
              onClick={() => setActiveTab('scanner')}
            >
              <i className="bi bi-qr-code-scan me-2"></i>QR Scanner
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="bi bi-clock-history me-2"></i>History
            </button>
          </li>
        </ul>

        {/* Volunteer Quick Actions */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/scan" className="btn btn-primary">
                    <i className="bi bi-qr-code-scan me-2"></i>Scan QR Code
                  </Link>
                  <Link to="/events" className="btn btn-success">
                    <i className="bi bi-calendar-check me-2"></i>View All Events
                  </Link>
                  <Link to="/volunteer/schedule" className="btn btn-info text-white">
                    <i className="bi bi-calendar-week me-2"></i>My Schedule
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Stats */}
        <div className="row mb-4">
          {getRoleStats().map((stat, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className={`bg-${stat.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </div>
                  <h3 className="display-6 fw-bold">{stat.value}</h3>
                  <p className="text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Events */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Your Assigned Events</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Event</th>
                        <th>Date & Time</th>
                        <th>Location</th>
                        <th>Your Role</th>
                        <th>Check-ins</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockVolunteerEvents.map(event => (
                        <tr key={event._id}>
                          <td>
                            <h6 className="mb-0">{event.title}</h6>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              <small className="text-muted">{event.time}</small>
                            </div>
                          </td>
                          <td>{event.location}</td>
                          <td>
                            <span className="badge bg-info">{event.role}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar bg-success" 
                                  role="progressbar" 
                                  style={{ width: `${(event.checkIns / event.totalRegistrations) * 100}%` }}
                                  aria-valuenow={event.checkIns} 
                                  aria-valuemin="0" 
                                  aria-valuemax={event.totalRegistrations}
                                ></div>
                              </div>
                              <span className="text-muted small">{event.checkIns}/{event.totalRegistrations}</span>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link to="/scan" className="btn btn-primary">
                                <i className="bi bi-qr-code-scan me-1"></i> Scan
                              </Link>
                              <Link to={`/events/${event._id}`} className="btn btn-outline-secondary">
                                <i className="bi bi-info-circle me-1"></i> Details
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Quick Scanner</h5>
              </div>
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <div className="bg-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '200px', height: '200px', border: '2px dashed #ccc' }}>
                    <i className="bi bi-camera fs-1 text-muted"></i>
                  </div>
                  <p className="text-muted">Camera preview will appear here</p>
                </div>
                <Link to="/scan" className="btn btn-primary">
                  <i className="bi bi-qr-code-scan me-2"></i>Launch Full Scanner
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Recent Check-ins</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                        <i className="bi bi-person-check fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">John Smith</h6>
                        <p className="text-muted mb-0 small">
                          Annual Tech Symposium • 30 minutes ago
                        </p>
                      </div>
                      <span className="badge bg-success ms-auto">Success</span>
                    </div>
                  </li>
                  <li className="list-group-item px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                        <i className="bi bi-person-check fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Emily Johnson</h6>
                        <p className="text-muted mb-0 small">
                          Annual Tech Symposium • 45 minutes ago
                        </p>
                      </div>
                      <span className="badge bg-success ms-auto">Success</span>
                    </div>
                  </li>
                  <li className="list-group-item px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-danger text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                        <i className="bi bi-x-circle fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Michael Brown</h6>
                        <p className="text-muted mb-0 small">
                          Annual Tech Symposium • 1 hour ago
                        </p>
                      </div>
                      <span className="badge bg-danger ms-auto">Invalid QR</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-footer bg-white border-0 text-center">
                <Link to="/check-ins/history" className="btn btn-sm btn-outline-primary">View All Check-ins</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Participant dashboard
  const renderParticipantDashboard = () => {
    return (
      <div className="fade-in">
        {/* Participant Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'registrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              <i className="bi bi-ticket-perforated me-2"></i>My Registrations
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              <i className="bi bi-compass me-2"></i>Discover Events
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="bi bi-clock-history me-2"></i>History
            </button>
          </li>
        </ul>

        {/* Participant Quick Actions */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/events" className="btn btn-primary">
                    <i className="bi bi-search me-2"></i>Browse Events
                  </Link>
                  <Link to="/registrations" className="btn btn-success">
                    <i className="bi bi-ticket-perforated me-2"></i>My Registrations
                  </Link>
                  <Link to="/certificates" className="btn btn-info text-white">
                    <i className="bi bi-award me-2"></i>My Certificates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participant Stats */}
        <div className="row mb-4">
          {getRoleStats().map((stat, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className={`bg-${stat.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </div>
                  <h3 className="display-6 fw-bold">{stat.value}</h3>
                  <p className="text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Registered Events */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Your Registered Events</h5>
                <Link to="/events" className="btn btn-sm btn-primary">
                  <i className="bi bi-plus-circle me-1"></i> Register for More
                </Link>
              </div>
              <div className="card-body p-0">
                {mockRegistrations.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5>No Registered Events</h5>
                    <p className="text-muted">You haven't registered for any events yet.</p>
                    <Link to="/events" className="btn btn-primary">
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {mockRegistrations.map(registration => (
                      <div className="list-group-item p-0" key={registration._id}>
                        <div className="row g-0">
                          <div className="col-md-2 bg-light d-flex flex-column align-items-center justify-content-center p-4 text-center">
                            <h5 className="mb-0">{new Date(registration.event.date).getDate()}</h5>
                            <p className="mb-0 text-muted">{new Date(registration.event.date).toLocaleString('default', { month: 'short' })}</p>
                          </div>
                          <div className="col-md-7 p-4">
                            <h5 className="mb-1">{registration.event.title}</h5>
                            <div className="mb-2 text-muted small">
                              <div className="d-flex align-items-center mb-1">
                                <i className="bi bi-clock me-2"></i>
                                {registration.event.time}
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt me-2"></i>
                                {registration.event.location}
                              </div>
                            </div>
                            <div>
                              {registration.attended ? (
                                <span className="badge bg-success">Attended</span>
                              ) : (
                                <span className="badge bg-warning text-dark">Not Attended</span>
                              )}
                            </div>
                          </div>
                          <div className="col-md-3 d-flex flex-column align-items-center justify-content-center p-4 border-start">
                            <button 
                              className="btn btn-outline-primary mb-2 w-100"
                              data-bs-toggle="modal" 
                              data-bs-target={`#qrModal-${registration._id}`}
                            >
                              <i className="bi bi-qr-code me-2"></i>Show QR
                            </button>
                            <Link to={`/events/${registration.event._id}`} className="btn btn-outline-secondary w-100">
                              <i className="bi bi-info-circle me-2"></i>Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Recommended Events */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Recommended for You</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {mockEvents.map(event => (
                    <Link to={`/events/${event._id}`} className="list-group-item list-group-item-action p-3" key={event._id}>
                      <div className="d-flex">
                        <img 
                          src={event.poster} 
                          alt={event.title} 
                          className="rounded me-3" 
                          width="60" 
                          height="60" 
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="mb-1">{event.title}</h6>
                          <p className="text-muted mb-1 small">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-muted mb-0 small">
                            <i className="bi bi-geo-alt me-1"></i>
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="card-footer bg-white border-0 text-center">
                <Link to="/events" className="btn btn-sm btn-outline-primary">View All Events</Link>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modals */}
        {mockRegistrations.map(registration => (
          <div className="modal fade" id={`qrModal-${registration._id}`} tabIndex="-1" aria-hidden="true" key={`modal-${registration._id}`}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Registration QR Code</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body text-center">
                  <h5 className="mb-3">{registration.event.title}</h5>
                  <p className="text-muted mb-4">
                    {formatDate(registration.event.date)} at {registration.event.time}
                  </p>
                  <div className="mb-4">
                    <img 
                      src={registration.qrCode} 
                      alt="Registration QR Code" 
                      className="img-fluid" 
                      style={{ maxWidth: '250px' }} 
                    />
                  </div>
                  <p className="text-muted">
                    Present this QR code at the event for attendance
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Download QR Code</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-4 fade-in">
      {/* Welcome Banner */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 bg-primary text-white shadow">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="display-6 fw-bold mb-3">Welcome, {currentUser.name}!</h2>
                  <p className="lead mb-0">
                    {currentUser.role === 'admin' ? 'Manage your events and users from your admin dashboard.' :
                     currentUser.role === 'organizer' ? 'Create and manage your events with ease.' :
                     currentUser.role === 'volunteer' ? 'Help manage events and track attendance.' :
                     'Discover and register for exciting campus events.'}
                  </p>
                </div>
                <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
                  <div className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center p-3" style={{ width: '100px', height: '100px' }}>
                    <i className={`bi ${
                      currentUser.role === 'admin' ? 'bi-person-workspace' :
                      currentUser.role === 'organizer' ? 'bi-calendar-event' :
                      currentUser.role === 'volunteer' ? 'bi-person-badge' :
                      'bi-person'
                    } fs-1`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;