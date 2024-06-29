import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; 

class SignupPage extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    errorMessage: '',
    showErrorMessage: false,
    showSuccessMessage: false,
  };

  submitSuccess = () => {
    this.setState({ showSuccessMessage: true, showErrorMessage: false });
  };

  submitFailure = (errorMsg) => {
    this.setState({ errorMessage: errorMsg, showErrorMessage: true, showSuccessMessage: false });
  };

  onSubmitSignupDetails = async (event) => {
    event.preventDefault();
    const { email, password, username } = this.state;
    const userDetails = { email, password, username };
    const url = 'http://localhost:3000/register/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      if (response.ok) {
        this.submitSuccess();
      } else {
        this.submitFailure(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      this.submitFailure('Network error');
    }
  };

  onChangeInputValue = (event) => {
    this.setState({ [event.target.name]: event.target.value, showErrorMessage: false });
  };

  render() {
    const { errorMessage, showErrorMessage, showSuccessMessage } = this.state;
    return (
      <div className="login-border-container">
        {showSuccessMessage ? (
          <div className='login-container'>
            <img src="https://res.cloudinary.com/dt54ntfw8/image/upload/v1719583985/grren_tick_p1r3a7.jpg" alt="success" className='success'/>
            <p className="success_msg">You have signed up successfully!</p>
            <Link to="/login"><button type="button" className="login-back-button">
              Click here to Login
            </button>
            </Link>
          </div>
        ) : (
          <form className="login-container" onSubmit={this.onSubmitSignupDetails}>
            <h1 className="login-head">Signup</h1>
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
                placeholder="Enter Valid Email"
                onChange={this.onChangeInputValue}
              />
            </div>
            <div className="user-details-container">
              <label className="email" htmlFor="username">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="input-email"
                required
                placeholder="Enter Username"
                onChange={this.onChangeInputValue}
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
                placeholder="Enter Valid Password"
                required
                onChange={this.onChangeInputValue}
              />
            </div>
            {showErrorMessage && <p className="error_msg">{errorMessage}</p>}
            {!showSuccessMessage && (
              <button type="submit" className="login-button">
                Signup
              </button>
            )}
          </form>
        )}
      </div>
    );
  }
}

export default SignupPage;
