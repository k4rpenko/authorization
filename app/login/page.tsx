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

    try {
      const res = await fetch("http://localhost:3000/api/logins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        setError(false);
        setspans("")
        const targetSiteURL = 'http://localhost:3000/home';
        window.location.href = targetSiteURL;
      } else if (res.status === 404) {
        setError(true);
      }else if(res.status === 401){
        setError(false);
        setspans("Invalid credentials")
      } 
      else {
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
            <h3>Sign in</h3>
            <p>
              Log in to your account with your email and password
            </p>
          </div>
          <form onSubmit={handleAdd} className='FormRegis'>
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <div className='ErrorRegister'>
              {Error ? <span>There is no account at the specified email address. You can <Link href="/login">Sign up</Link> account at this email address </span>: null}
              <span>{spans}</span>
            </div>
            <button type="submit">Sign in</button>
            <p>Already have an account? <Link href="/register">Sign up</Link> in instead.</p>
          </form>
        </div>
      </div>
    </div>
  );
}