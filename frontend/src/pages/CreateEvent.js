import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    poster: null
  });
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setForm({ ...form, poster: files[0] });
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validation
    if (!form.title || !form.date || !form.time || !form.location || !form.capacity || !form.description) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    // Here you would send the form data (including the file) to your backend API
    // For now, just show a success message
    alert('Event created successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h3 className="mb-4 text-center text-primary">Create New Event</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Event Title *</label>
                  <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Date *</label>
                    <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Time *</label>
                    <input type="time" className="form-control" name="time" value={form.time} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Location *</label>
                  <input type="text" className="form-control" name="location" value={form.location} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Capacity *</label>
                  <input type="number" className="form-control" name="capacity" value={form.capacity} onChange={handleChange} required min="1" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Poster Image *</label>
                  <input type="file" className="form-control" name="poster" accept="image/*" onChange={handleChange} required />
                  {preview && (
                    <div className="mt-2">
                      <img src={preview} alt="Poster Preview" className="img-thumbnail" style={{ maxHeight: 180 }} />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="3" required></textarea>
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold">Create Event</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;