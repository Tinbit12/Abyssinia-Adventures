
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api';
import './Auth.css';

function Auth({ setCurrentUser }) {
  const [mode, setMode] = useState('login'); 

 
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const isLoginValid = useMemo(() => {
    return Boolean(loginData.email.trim() && loginData.password);
  }, [loginData.email, loginData.password]);

  const isStrongPassword = (value) => {
    if (!value) return false;
   
    const strongRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}_+\-=:;'",.<>/?`~|]).{8,}$/;
    return strongRegex.test(value);
  };

  const isSignupValid = useMemo(() => {
    return Boolean(
      signupData.name.trim() &&
        signupData.email.trim() &&
        signupData.password &&
        signupData.confirmPassword &&
        signupData.password === signupData.confirmPassword &&
        isStrongPassword(signupData.password)
    );
  }, [
    signupData.name,
    signupData.email,
    signupData.password,
    signupData.confirmPassword,
  ]);

  const signupPasswordMismatch = useMemo(() => {
    if (isLogin) return false;
    if (!signupData.confirmPassword) return false;
    return signupData.password !== signupData.confirmPassword;
  }, [isLogin, signupData.password, signupData.confirmPassword]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setMessage('');
    setMessageType('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setMessage('');
    setMessageType('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage('');
    setMessageType('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!isLoginValid) {
      setMessageType('error');
      setMessage('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await login({
        email: loginData.email.trim(),
        password: loginData.password,
      });
      setMessageType('success');
      setMessage('Login successful.');

      
      if (data?.user && typeof setCurrentUser === 'function') {
        setCurrentUser({ ...data.user, role: data.user.role || 'user' });
      }
      if (data?.token) {
        localStorage.setItem('abyssinia_token', data.token);
      }

      
      navigate('/');
    } catch (err) {
      setMessageType('error');
      setMessage(err?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (signupData.password !== signupData.confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (!isSignupValid) {
      setMessageType('error');
      setMessage('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: signupData.name.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
      });
      setMessageType('success');
      setMessage('Account created successfully. You can now log in.');
      setMode('login');
      setLoginData({ email: signupData.email.trim(), password: '' });
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setMessageType('error');
      setMessage(err?.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero section">
        <div className="container">
          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
          <p>
            {isLogin
              ? 'Welcome back! Login to continue.'
              : 'Create an account to get started.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="auth-card">
            <div className="auth-tabs" role="tablist" aria-label="Authentication">
              <button
                type="button"
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => switchMode('login')}
                aria-selected={isLogin}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => switchMode('signup')}
                aria-selected={!isLogin}
              >
                Sign Up
              </button>
            </div>

            {message && (
              <div className={`auth-message ${messageType || ''}`}>{message}</div>
            )}

            {isLogin ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="auth-field">
                  <label htmlFor="loginEmail">Email</label>
                  <input
                    id="loginEmail"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="loginPassword">Password</label>
                  <input
                    id="loginPassword"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={!isLoginValid || isSubmitting}
                  aria-disabled={!isLoginValid || isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignupSubmit}>
                <div className="auth-field">
                  <label htmlFor="signupName">Name</label>
                  <input
                    id="signupName"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="signupEmail">Email</label>
                  <input
                    id="signupEmail"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="signupPassword">Password</label>
                  <input
                    id="signupPassword"
                    name="password"
                    type="password"
                    placeholder="At least 8 chars, letters, numbers & symbols"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    autoComplete="new-password"
                  />
                  {!isLogin && signupData.password && !isStrongPassword(signupData.password) && (
                    <small className="auth-hint">
                      Password must be at least 8 characters and include letters, numbers, and symbols.
                    </small>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="signupConfirmPassword">Confirm Password</label>
                  <input
                    id="signupConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    autoComplete="new-password"
                    className={signupPasswordMismatch ? 'invalid' : ''}
                  />
                  {signupPasswordMismatch && (
                    <small className="auth-hint">Passwords must match.</small>
                  )}
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={!isSignupValid || isSubmitting}
                  aria-disabled={!isSignupValid || isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Sign Up'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Auth;
