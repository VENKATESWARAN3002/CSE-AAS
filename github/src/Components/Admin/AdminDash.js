import React from 'react';
import { Link } from 'react-router-dom';

const AdminDash = () => {

  return (
    <div className='admin-dashboard'>
      <h2>Admin Dashboard</h2>
      <nav>
          <li>
            <Link to="/admin/viewStudent">View Students</Link>
          </li>
          <li>
            <Link to="/admin/viewFaculty">View Faculty Details</Link>
          </li>
          <li>
            <Link to="/admin/updateStudent">Update Student Detaiuls</Link>
          </li>
          <li>
            <Link to="/admin/course">Course Management</Link>
          </li>
      </nav>
    </div>
  );
};

export default AdminDash;
