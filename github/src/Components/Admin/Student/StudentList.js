import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {db} from '../../../firebase';
import StudentDetailsModal from '../../Student/StudentDetailsModal';
import UpdateStudentForm from './UpdateStudentForm';

const StudentsList = ( { students = [] }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMessage, setViewMessage] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  console.log('Received students data:', students);
  const [deleteMessage, setDeleteMessage] = useState(null); 
  
  const viewStudent = (student) => {
    setSelectedStudent(student);
    setViewMessage('Student details opened!');
    setShowModal(true);  // Display success message for view
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModal1 = () => {
    setShowModal1(false);
  };

  const updateStudent = async (updatedStudent) => {
    setUpdateMessage(null); // Clear previous message (optional)
    try {
      const studentRef = collection(db, 'tbl_Student');
      const studentQuery = query(studentRef, where('register_no', '==', updatedStudent.register_no));
      const querySnapshot = await getDocs(studentQuery);
  
      if (querySnapshot.empty) {
        console.error('No matching document found for register_no:', updatedStudent.register_no);
        setUpdateMessage('Student not found. Update failed.');
        return;
      }
  
      // Assuming unique register_no, use the first document's reference
      const doc = querySnapshot.docs[0].ref; // **Ensure this is a reference object**
  
      await updateDoc(doc, updatedStudent);
      console.log('Student updated successfully!');
      setUpdateMessage('Student details updated successfully!');
    } catch (error) {
      console.error('Error updating student details:', error);
      setUpdateMessage('An error occurred. Please try again.');
    }
  };

  const deleteStudent = async (registerNo) => {
    setDeleteMessage(null); // Clear previous message
    try {
      const StudentRef = query(collection(db, 'tbl_Student'), where('register_no', '==', registerNo)); // Query by c_code
      const snapshot = await getDocs(StudentRef);
      if (snapshot.empty) {
        console.error('Student not found');
        setDeleteMessage('Student not found');
        return;
      }
      const doc = snapshot.docs[0]; // Assuming there's only one course with the code
      await deleteDoc(doc.ref);
      setDeleteMessage('Student details deleted successfully!');
    } catch (error) {
      console.error('Error deleting student details:', error);
      setDeleteMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='student-list'>
      <h2>Students</h2>
      {students.length > 0 ? (
        <table border={1}>
          <thead>
            <tr>
              <th>RegNo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}> {/* Use the index as the unique key */}
              {console.log('Student data:', student)}
                <td>{student.register_no}</td>
                <td>{student.std_name }</td>
                <td>{student.std_email }</td>
                <td>{student.std_phone }</td>
                <td>{student.std_dob}</td>
                <td>{student.std_gender}</td>
                <td>
                  <button onClick={() => viewStudent(student)}>View</button>
                  <button onClick={() => { setSelectedStudent(student); setShowModal1(true); }}>Update</button> 
                  <button onClick={() => deleteStudent(student.register_no)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}

{updateMessage && (
        <div className={`update-message ${updateMessage.includes('success') ? 'success' : 'error'}`}>
          {updateMessage}
        </div>
      )}

      {deleteMessage && (
              <div className={`delete-message ${deleteMessage.includes('success') ? 'success' : 'error'}`}>
                {deleteMessage}
              </div>
            )}

{showModal && selectedStudent && (
        <StudentDetailsModal student={selectedStudent} onClose={closeModal}/>
      )}
      
      {showModal1 && selectedStudent && (
        <UpdateStudentForm student={selectedStudent} onClose={closeModal1} onUpdate={updateStudent}/>
      )}


    </div>
  );
};

export default StudentsList;
