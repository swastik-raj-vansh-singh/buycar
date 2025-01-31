import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inventory({ token }) {
  const [listings, setListings] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [color, setColor] = useState('');
  const [mileageMax, setMileageMax] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, []);

  const fetchListings = async () => {
    try {
      const query = [];
      if (priceMin) query.push(`priceMin=${priceMin}`);
      if (priceMax) query.push(`priceMax=${priceMax}`);
      if (color) query.push(`color=${color}`);
      if (mileageMax) query.push(`mileageMax=${mileageMax}`);
      const url = `http://localhost:5000/api/inventory?${query.join('&')}`;
      const res = await axios.get(url);
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteMany = async () => {
    if (!token) {
      alert('You must be logged in to delete listings!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/inventory/deleteMany',
        { ids: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Selected listings deleted');
      setSelectedIds([]);
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Inventory</h2>
      <form onSubmit={handleFilter}>
        <div>
          <label>Min Price:</label>
          <input 
            type="number"
            value={priceMin}
            onChange={(e)=>setPriceMin(e.target.value)}
          />
        </div>
        <div>
          <label>Max Price:</label>
          <input 
            type="number"
            value={priceMax}
            onChange={(e)=>setPriceMax(e.target.value)}
          />
        </div>
        <div>
          <label>Color:</label>
          <input 
            type="text"
            value={color}
            onChange={(e)=>setColor(e.target.value)}
          />
        </div>
        <div>
          <label>Max Mileage (km):</label>
          <input 
            type="number"
            value={mileageMax}
            onChange={(e)=>setMileageMax(e.target.value)}
          />
        </div>
        <button type="submit">Apply Filters</button>
      </form>

      {selectedIds.length > 0 && (
        <button onClick={handleDeleteMany}>Delete Selected</button>
      )}

      <div>
        {listings.map(item => (
          <div 
            key={item._id} 
            style={{ border: '1px solid gray', margin: '10px 0', padding: 10 }}
          >
            <input 
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={() => handleSelect(item._id)}
            />
            <h3>{item.title || 'No Title'}</h3>
            {item.imageURL && (
              <img src={item.imageURL} alt={item.title} width="150" />
            )}
            <p>Dealer Email: {item.dealer?.email}</p>
            <p>KM Odometer: {item.kmOdometer}</p>
            <p>OEM: {item.oemSpec?.modelName} ({item.oemSpec?.modelYear})</p>
            <p>Available Colors: {item.oemSpec?.availableColors?.join(', ')}</p>
            <p>Price: {item.sellingPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
