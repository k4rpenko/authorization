"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [Error, setError] = useState(false);
  const [spans, setspans] = useState("");

  const handleAdd = async function (e: { preventDefault: () => void; }) {
    e.preventDefault();
  
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (email.length === 0) {
      setError(false);
      setspans("Email cannot be empty");
      return; 
    }

    if (!emailRegex.test(email)) {
      setError(false);
      setspans("Invalid email format");
      return;
    }
  
    if (password.length < 7) {
      setError(false);
      setspans("This password must be more than 7 characters long");
      return;
    }

    if (password != password2) {
      setError(false);
      setspans("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        setError(false);
        const targetSiteURL = 'http://localhost:3000/login';
        window.location.href = targetSiteURL;
      } else if (res.status === 401) {
        setError(true);
      } else {
        console.error('Unexpected error while getting data:', res.status);
        setError(true);
      }
    } catch (error) {
      console.error('Error during data retrieval:', error);
      setError(true);
    }
  };
  


  return (
    <div>
      <div className='block'>
        <div className='Authorization'>
          <div className="about">
            <h3>Sign Up</h3>
            <p>
              Create an account with your email and password
            </p>
          </div>
          <form onSubmit={handleAdd} className='FormRegis'>
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <input type="password" name="password2" placeholder="Password" onChange={(e) => setPassword2(e.target.value)} value={password2}/>
            <div className='ErrorRegister'>
              {Error ? <span>This email address is busy, please <Link href="/login">login</Link> in or enter another email</span>: null}
              <span>{spans}</span>
            </div>
            <button type="submit">Register</button>
            <p>Already have an account? <Link href="/login">Sign in</Link> in instead.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
