import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedContext } from '../context/MedContext';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(MedContext);

  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Temporary credentials for demo
  const tempCredentials = {
    username: 'doc',
    password: 'meddemo123@'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      // Login logic
      // console.log('Login attempted with:', credentials);
      
      // Check against temp credentials
      if (
        (credentials.username === tempCredentials.username || 
         credentials.username === tempCredentials.email) && 
        credentials.password === tempCredentials.password
      ) {
        login(); // Set authentication state
        navigate('/');
      } else {
        // Failed login
        setError('Invalid username or password');
      }
    } else {
      // Signup logic
      // console.log('Signup attempted with:', credentials);
      
      // Validation checks
      if (!credentials.email || !credentials.username || !credentials.password) {
        setError('All fields are required');
        return;
      }
      
      if (credentials.password !== credentials.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (credentials.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      
      // If all validation passes, you would normally create an account here
      // For demo, let's just switch to login view
      setIsLogin(true);
      setCredentials({
        ...credentials,
        confirmPassword: ''
      });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Image with overlay text */}
      <div className="hidden md:flex md:w-1/2 relative">
        {/* Background Image */}
        <img
          src="/login.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />

        {/* Blue Overlay */}
        <div className="absolute inset-0 bg-[#1A73E880]"></div>

        {/* Text on top of overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12">
          <h1 className="text-white text-5xl font-bold tracking-wider">
            Powerful Insights<br />
            at your Fingertips.
          </h1>
        </div>
      </div>

      {/* Right side - Login/Signup form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-[#f8f8f8]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-end absolute top-10 right-20">
            <img src="/jnc-svg.svg" alt="JNC Logo" className="w-18" />
          </div>

          {/* Welcome text */}
          <h2 className="text-3xl font-bold text-center mb-2 ">
            {isLogin ? 'Welcome to MedCopilot' : 'Create Your Account'}
          </h2>
          <p className="text-center mb-8">
            {isLogin ? (
              <>Don't have an account? <button onClick={toggleForm} className="text-blue-600 hover:underline">Sign up for free</button></>
            ) : (
              <>Already have an account? <button onClick={toggleForm} className="text-blue-600 hover:underline">Log in</button></>
            )}
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Login/Signup form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-[90%] m-auto">
            {/* Email field - only for signup */}
            {!isLogin && (
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>
            )}
            
            {/* Username field */}
            <div>
              <input
                type="text"
                name="username"
                placeholder={isLogin ? "Username or Email" : "Username"}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            
            {/* Password field */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
            
            {/* Confirm Password field - only for signup */}
            {!isLogin && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#13181E] cursor-pointer text-white py-3  rounded-xl hover:bg-gray-800 transition-colors"
              >
                {isLogin ? 'Log in' : 'Sign up'}
              </button>
            </div>
          </form>

          {/* Only show these options for login view */}
          {isLogin && (
            <>
              {/* OR divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Social logins */}
              {/* <div className="space-y-3 w-[90%] m-auto">
                <button className="w-full border border-gray-300 py-3 px-4 bg-white rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                  <img src="/google.png" className='w-4 h-4' alt="" />
                  <span>Log in with Google</span>
                </button>
                <button className="w-full border border-gray-300 py-3 px-4 bg-white rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                  <img src="/apple-logo.png" className='w-4 h-4' alt="" />
                  <span>Log in with Apple</span>
                </button>
                <button className="w-full border border-gray-300 py-3 px-4 bg-white rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                  <span>Use Single Sign-On (SSO)</span>
                </button>
              </div> */}

              {/* Forgot password */}
              <div className="text-center mt-6">
                <a href="#" className="text-gray-600 hover:underline text-sm">Forgot Password</a>
              </div>
            </>
          )}
          
          {/* Demo credentials helper */}
          {/* <div className="mt-8 text-center text-sm text-gray-500">
            <p>For demo: use username "{tempCredentials.username}" and password "{tempCredentials.password}"</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;