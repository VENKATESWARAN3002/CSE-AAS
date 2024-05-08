import React, { useState, useEffect } from 'react';

const UpdateCourseForm = ({ course, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    c_code: '',
    c_name: '',
    c_type: '',
    program: '',
    semester: '',
    c_TC: '',
    COs:'',
  });

  useEffect(() => {
    // Pre-fill the form with student data when the component mounts
    setFormData({
        c_code  : course.c_code, // Assuming register_no is unique
        c_name  : course.c_name,
        c_type  : course.c_type,
        program : course.program ,
        semester: course.semester,
        c_TC    : course.c_TC ,
        COs     : course.COs,
    });
  }, [course]); // Update effect on student data change

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
      <h2>Update Course Details</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="c_code">Course Code:</label>
        <input
          type="text"
          id="c_code"
          name="c_code"
          value={formData.c_code}
          disabled // Assuming register_no is unique and shouldn't be changed
          onChange={handleChange}
        />
        <label htmlFor="c_name">Course Name:</label>
        <input
          type="text"
          id="c_name"
          name="c_name"
          value={formData.c_name}
          onChange={handleChange}
        />
        <label htmlFor="c_name">Course Name:</label>
        <textarea
          id="COs"
          name="COs"
          value={formData.COs}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UpdateCourseForm;
