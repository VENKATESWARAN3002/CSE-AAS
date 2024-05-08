import React from 'react';
import { useNavigate } from 'react-router-dom';
import stdImage from './program-2-DRqwF0EM.png';
import facImage from './program-3-C0g4YULi.png';
import adminImage from './user-2-UK2CIdqi.png';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginClick = (userType) => {
    navigate(`/${userType}/login`); // Redirect based on user type
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <div className='login-options'>
        <button
          type='button'
          className='login-option'
          onClick={() => handleLoginClick('student')}
        >
          <img src={stdImage} alt='Student Login' />
          <span>Student Login</span>
        </button>
        <button
          type='button'
          className='login-option'
          onClick={() => handleLoginClick('faculty')}
        >
          <img src={facImage} alt='Faculty Login' />
          <span>Faculty Login</span>
        </button>
        <button
          type='button'
          className='login-option'
          onClick={() => handleLoginClick('admin')}
        >
          <img src={adminImage} alt='Admin Login' />
          <span>Admin Login</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
