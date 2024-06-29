import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const navigate = useNavigate();

  const submitSuccess = (jwtToken) => {
    console.log(jwtToken);
    Cookies.set('jwtToken', jwtToken, {
      expires: 30,
      path: '/',
    });
    navigate('/');  
  };

  const submitFailure = (errorMsg) => {
    setErrorMessage(errorMsg);
    setShowErrorMessage(true);
  };

  const onSubmitLoginDetails = async (event) => {
    event.preventDefault();
    const userDetails = { email, password };
    const url = 'https://breweriesaddreviewsweb2.onrender.com/login/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        submitSuccess(data.jwtToken);
      } else {
        submitFailure(data.error || data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      submitFailure('Network error occurred');
    }
  };

  return (
    <div className="login-border-container">
      <form className="login-container" onSubmit={onSubmitLoginDetails}>
        <h1 className="login-head">Login</h1>
        <div className="user-details-container">
          <label className="email" htmlFor="email">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="input-email"
            required
            placeholder='Enter Valid Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="user-details-container">
          <label className="email" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="input-email"
            placeholder='Enter Valid Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {showErrorMessage && <p className="error_msg">{errorMessage}</p>}
        <div className="buttons">
          <button type="submit" className="login-button">
            Login
          </button>
          <Link to="/signup">
            <button type="button" className="login-button">  
              Signup
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
