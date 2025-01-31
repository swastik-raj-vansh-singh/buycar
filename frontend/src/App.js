import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AddCar from './pages/AddCar';
import Inventory from './pages/Inventory';

function App() {
  // Store token in React state (and/or localStorage)
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <nav style={{ display: 'flex', gap: '10px', margin: '10px' }}>
        <Link to="/signup">SignUp</Link>
        <Link to="/login">Login</Link>
        <Link to="/addcar">AddCar</Link>
        <Link to="/inventory">Inventory</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/addcar" element={<AddCar token={token} />} />
        <Route path="/inventory" element={<Inventory token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
