import React from 'react';
import { Link } from 'react-router-dom';

const FacultyDash = () => {

  return (
    <div className='admin-dashboard'>
      <h2>Admin Dashboard</h2>
      <nav>
          <li>
            <Link to="/admin/viewStudent">View Students</Link>
          </li>
      </nav>
    </div>
  );
};

export default FacultyDash;
