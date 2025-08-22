import React, { useState } from 'react';

const mockVolunteers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '9876543210', event: 'Annual Tech Symposium', role: 'Registration Desk' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '9123456780', event: 'Cultural Fest 2023', role: 'Stage Manager' },
  { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', phone: '9988776655', event: 'Hackathon 2023', role: 'Mentor' },
];

const ManageVolunteers = () => {
  const [volunteers] = useState(mockVolunteers);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Volunteers</h2>

      {/* QR Scanner Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Scan Volunteer QR Code</h5>
          <p className="alert alert-info">
            QR code scanner will be implemented here.
          </p>
          {/* You can add a real QR scanner component here later */}
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assigned Event</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(vol => (
                <tr key={vol.id}>
                  <td>{vol.name}</td>
                  <td>{vol.email}</td>
                  <td>{vol.phone}</td>
                  <td>{vol.event}</td>
                  <td>{vol.role}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" disabled>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" disabled>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary mt-3" disabled>
            <i className="bi bi-plus-circle me-2"></i>Add Volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageVolunteers;