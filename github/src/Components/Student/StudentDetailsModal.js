import React from 'react';

const StudentDetailsModal = ({ student, onClose }) => {
  // Handle potential scenario where student data is missing
  if (!student) {
    return (
      <div className='modal'>
        <h2>Student Details</h2>
        <p>Student information unavailable.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className='modal'> {/* Style the modal appropriately */}
      <h2>Personal Details</h2>
      <p><b>RegNo:</b> {student.register_no}</p>
      <p><b>Name:</b> {student.std_name}</p>
      <p><b>DOB:</b> {student.std_dob}</p>
      <p><b>Gender:</b> {student.std_gender}</p>
      <p><b>program:</b> {student.program}</p>
      <p><b>Academic Year:</b> {student.academic_year}</p>
      <p><b>Address:</b> {student.address}</p>
      <p><b>Email:</b> {student.std_email}</p>
      <p><b>Phone:</b> {student.std_phone}</p>
      <h2>Academic Details</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default StudentDetailsModal;
