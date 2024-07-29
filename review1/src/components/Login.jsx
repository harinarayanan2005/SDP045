import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleToggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignInSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError(null);
    setIsLoggedIn(true);
    navigate('/', { state: { message: 'Logged in successfully!' } });
    console.log('Sign in submitted');
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    console.log('Sign up submitted');
    navigate('/', { state: { message: 'Signed up successfully!' } });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <section>
      <div className={`container ${isSignIn ? '' : 'active'}`}>
        <div className="user signinBx">
          <div className="imgBx">
            <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img1.jpg" alt="" />
          </div>
          <div className="formBx">
            <form onSubmit={handleSignInSubmit}>
              <h2>Sign In</h2>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
              <input type="submit" value="Login" />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              {isLoggedIn && <div style={{ color: 'green' }}>Logged in Successfully!</div>}
              <p className="signup">
                Don't have an account?
                <a href="#" onClick={handleToggleForm}>Sign Up.</a>
              </p>
            </form>
          </div>
        </div>
        <div className="user signupBx">
          <div className="formBx">
            <form onSubmit={handleSignUpSubmit}>
              <h2>Create an account</h2>
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create Password" />
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm Password" />
              <input type="submit" value="Sign Up" />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <p className="signup">
                Already have an account?
                <a href="#" onClick={handleToggleForm}>Sign in.</a>
              </p>
            </form>
          </div>
          <div className="imgBx">
            <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img2.jpg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
