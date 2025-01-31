import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddCar({ token }) {
  const [oemSpecs, setOemSpecs] = useState([]);
  const [form, setForm] = useState({
    oemSpec: '',
    kmOdometer: '',
    majorScratches: false,
    originalPaint: false,
    numberOfAccidents: 0,
    numberOfPreviousBuyers: 0,
    registrationPlace: '',
    imageURL: '',
    title: '',
    bulletPoints: '',
    sellingPrice: ''
  });
  const [message, setMessage] = useState('');

  // Fetch OEM specs to show in dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/api/oem')
      .then(res => setOemSpecs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert bulletPoints string into array
      const bulletArray = form.bulletPoints.split(';').map(bp => bp.trim());
      const data = {
        ...form,
        bulletPoints: bulletArray
      };
      const res = await axios.post('http://localhost:5000/api/inventory', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Car listing created successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating listing');
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Add a Second-Hand Car</h2>
      {!token && <p style={{color: 'red'}}>You must be logged in to create a listing!</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>OEM Spec:</label>
          <select name="oemSpec" value={form.oemSpec} onChange={handleChange}>
            <option value="">-- select --</option>
            {oemSpecs.map(spec => (
              <option key={spec._id} value={spec._id}>
                {spec.modelName} {spec.modelYear}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>KM Odometer:</label>
          <input
            type="number"
            name="kmOdometer"
            value={form.kmOdometer}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Major Scratches: </label>
          <input
            type="checkbox"
            name="majorScratches"
            checked={form.majorScratches}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Original Paint: </label>
          <input
            type="checkbox"
            name="originalPaint"
            checked={form.originalPaint}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Accidents: </label>
          <input
            type="number"
            name="numberOfAccidents"
            value={form.numberOfAccidents}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Previous Buyers: </label>
          <input
            type="number"
            name="numberOfPreviousBuyers"
            value={form.numberOfPreviousBuyers}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Registration Place: </label>
          <input
            type="text"
            name="registrationPlace"
            value={form.registrationPlace}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image URL: </label>
          <input
            type="text"
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Title: </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bullet Points (separated by ";"): </label>
          <input
            type="text"
            name="bulletPoints"
            value={form.bulletPoints}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Selling Price: </label>
          <input
            type="number"
            name="sellingPrice"
            value={form.sellingPrice}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={!token}>Create Listing</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
