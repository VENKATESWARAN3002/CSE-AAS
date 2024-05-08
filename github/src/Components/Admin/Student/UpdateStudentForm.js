import React, { useState, useEffect } from 'react';

const UpdateStudentForm = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    register_no: '',
    std_name: '',
    std_email: '',
    std_phone: '',
    std_dob: '',
    std_gender: '',
    address:'',
  });

  useEffect(() => {
    // Pre-fill the form with student data when the component mounts
    setFormData({
      register_no: student.register_no, // Assuming register_no is unique
      std_name: student.std_name,
      std_email: student.std_email,
      std_phone: student.std_phone,
      std_dob: student.std_dob,
      std_gender: student.std_gender,
      address:student.address,
    });
  }, [student]); // Update effect on student data change

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form data to update:', formData); // Log updated data
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="update-student-form">
      <h2>Update Student Details</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register_no">Register No.:</label>
        <input
          type="text"
          id="register_no"
          name="register_no"
          value={formData.register_no}
          disabled // Assuming register_no is unique and shouldn't be changed
          onChange={handleChange}
        />
        <label htmlFor="std_name">Name:</label>
        <input
          type="text"
          id="std_name"
          name="std_name"
          value={formData.std_name}
          onChange={handleChange}
        />

        <label htmlFor="std_phone">Phone:</label>
        <input
          type="tel"
          id="std_phone"
          name="std_phone"
          value={formData.std_phone}
          onChange={handleChange}
        />
        <label htmlFor="std_dob">Date of Birth:</label>
        <input
          type="date"
          id="std_dob"
          name="std_dob"
          value={formData.std_dob}
          onChange={handleChange}
        />
        <label htmlFor="std_gender">Gender:</label>
        <select id="std_gender" name="std_gender" value={formData.std_gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="std_dob">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <button type="submit">Update Student</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UpdateStudentForm;
