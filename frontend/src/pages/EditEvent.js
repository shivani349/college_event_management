import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import Toast from '../components/Toast';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(id);
        const event = res.data;
        setForm({
          title: event.title || '',
          date: event.date ? event.date.slice(0,10) : '',
          time: event.time || '',
          location: event.location || '',
          capacity: event.capacity || '',
          description: event.description || '',
          poster: null
        });
        if (event.poster?.fileUrl) {
          setPreview(`http://localhost:5000${event.poster.fileUrl}`);
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setForm({ ...form, poster: files[0] });
      setPreview(files[0] ? URL.createObjectURL(files[0]) : preview);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.location || !form.capacity || !form.description) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    try {
      await eventService.updateEvent(id, form);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(`/events/${id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update event.');
    }
  };

  if (loading) return <div className="container py-4 text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h3 className="mb-4 text-center text-primary">Edit Event</h3>
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
                  <label className="form-label fw-semibold">Poster Image</label>
                  <input type="file" className="form-control" name="poster" accept="image/*" onChange={handleChange} />
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
                <button type="submit" className="btn btn-success w-100 fw-bold">Update Event</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast message="Event updated successfully!" show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default EditEvent;
