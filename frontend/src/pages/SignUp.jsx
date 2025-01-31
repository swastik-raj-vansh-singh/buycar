import React, { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email, password
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
