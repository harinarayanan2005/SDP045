import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from './Snackbar'; // Snackbar for feedback
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  // Set axios to include credentials
  axios.defaults.withCredentials = true;

  const handleToggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password || !validateEmail(email) || password.length < 8) {
      setSnackbar({ message: 'Please check your input', type: 'error' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      onLogin({ email });
      localStorage.setItem('isAuthenticated', 'true');
      setSnackbar({ message: 'Sign in successful', type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Sign in error:', error.response || error);
      setSnackbar({ message: 'Login failed', type: 'error' });
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email) || password.length < 8 || password !== confirmPassword) {
      setSnackbar({ message: 'Please check your input', type: 'error' });
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/auth/signup', { email, password, username });
      setSnackbar({ message: 'Sign up successful', type: 'success' });
      setIsSignIn(true); // Switch to sign-in form
    } catch (error) {
      console.error('Sign up error:', error.response || error);
      setSnackbar({ message: 'Sign up failed', type: 'error' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ message: '', type: '' });
  };

  return (
    <>
      <section>
        <div className={`container ${isSignIn ? '' : 'active'}`}>
          <div className="user signinBx">
            <div className="imgBx">
              <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img1.jpg" alt="" />
            </div>
            <div className="formBx">
              <form onSubmit={handleSignInSubmit}>
                <h2>Sign In</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <input type="submit" value="Login" />
                <p className="signup">
                  Don't have an account? <a href="#" onClick={handleToggleForm}>Sign Up.</a>
                </p>
              </form>
            </div>
          </div>
          <div className="user signupBx">
            <div className="formBx">
              <form onSubmit={handleSignUpSubmit}>
                <h2>Create an account</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                <input type="submit" value="Sign Up" />
                <p className="signup">
                  Already have an account? <a href="#" onClick={handleToggleForm}>Sign in.</a>
                </p>
              </form>
            </div>
            <div className="imgBx">
              <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img2.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Snackbar Component */}
      <Snackbar message={snackbar.message} type={snackbar.type} onClose={handleSnackbarClose} />
    </>
  );
};

export default Login;
