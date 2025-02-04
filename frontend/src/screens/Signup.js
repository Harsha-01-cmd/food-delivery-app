import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [address, setAddress] = useState("");
  const [error, setError] = useState(""); // For error messages
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let navLocation = () => {
        return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 });
        });
      };

      let latlong = await navLocation();
      let latitude = latlong.coords.latitude;
      let longitude = latlong.coords.longitude;

      const response = await fetch("http://localhost:5000/api/auth/getlocation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latlong: { lat: latitude, long: longitude } })
      });

      const { location } = await response.json();
      setAddress(location);
      setCredentials({ ...credentials, geolocation: location });

    } catch (err) {
      console.error(err);
      setError("Failed to fetch location. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation
        })
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem('token', json.authToken);
        navigate("/login");
      } else {
        setError(json.message || "Failed to create user. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover', height: '100vh' }}>
      <Navbar />
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name='name'
              value={credentials.name}
              onChange={onChange}
              aria-describedby="nameHelp"
            />
          </div>
          <div className="m-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name='email'
              value={credentials.email}
              onChange={onChange}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="m-3">
            <label htmlFor="address" className="form-label">Address</label>
            <fieldset>
              <input
                type="text"
                className="form-control"
                name='address'
                placeholder="Click below to fetch address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-describedby="addressHelp"
                disabled
              />
            </fieldset>
          </div>
          <div className="m-3">
            <button
              type="button"
              onClick={handleClick}
              name="geolocation"
              className="btn btn-success"
            >
              Click for current Location
            </button>
          </div>
          <div className="m-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name='password'
              value={credentials.password}
              onChange={onChange}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
        </form>
      </div>
    </div>
  );
}
