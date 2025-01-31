import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      setMessage('Login successful!');
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input 
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
