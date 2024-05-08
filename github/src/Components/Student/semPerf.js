import React, { useState, useEffect } from 'react';
import { getDocs, addDoc, collection, where, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

import { db } from '../../firebase'; // Replace with your Firebase configuration

function SemPerf() {
  const [students, setStudents] = useState([]); // Array to store student options
  const [programs, setPrograms] = useState([]); // Array to store program options
  const [courses, setCourses] = useState([]); // Array to store all course options
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(''); // Optional if program name is stored
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseList, setCourseList] = useState([]); // Array to store selected courses
  const [semesters, setSemesters] = useState([]); 
  const [selectedSemester,setSelectedSemester] = useState([]);// Array to store available semesters for selected program

  // Function to fetch student data from Firestore
  const getStudents = async () => {
    const studentsRef = query(collection(db, "tbl_Student"), orderBy('std_name', 'asc'));
    try {
      const querySnapshot = await getDocs(studentsRef);
      const studentOptions = [];
      querySnapshot.forEach((doc) => {
        studentOptions.push({ id: doc.id, std_name: doc.data().std_name });
      });
      setStudents(studentOptions);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to fetch program data from Firestore (optional)
  const getPrograms = async () => {
    const programsRef = collection(db, "tbl_program");
    try {
      const querySnapshot = await getDocs(programsRef);
      const programOptions = [];
      querySnapshot.forEach((doc) => {
        programOptions.push({ id: doc.id, programName: doc.data().program_name });
      });
      setPrograms(programOptions);
    } catch (error) {
      console.error("Error fetching programs:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to fetch course data from Firestore
  const getCourses = async () => {
    const coursesRef = collection(db, "tbl_course");
    try {
      const querySnapshot = await getDocs(coursesRef);
      const courseOptions = [];
      querySnapshot.forEach((doc) => {
        courseOptions.push({ value: doc.id, label: doc.data().c_name, sem: doc.data().semester }); // Use courseCode for display
      });
      setCourses(courseOptions); // Store all courses initially
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to update semesters based on selected program
  const updateSemesters = async () => {
    const programSemesters = { // Assuming programSemesters data is available
      'MCA': ['First', 2, 3, 4],
      'M.Tech': [1, 2, 3, 4],
      'B.Tech(CSE)': [1, 2, 3, 4, 5, 6, 7, 8]
    };

    const programName = programs.find((program) => program.id === selectedProgram)?.programName;
    const semestersForProgram = programSemesters[programName] || [];
    setSemesters(semestersForProgram);

    // Filter courses based on selected program (optional, for efficiency)
    const filteredCoursesByProgram = courses.filter((course) => semestersForProgram.includes(course.sem));
    setCourses(filteredCoursesByProgram); // Update courses state with filtered courses
  };

  // Function to update courses based on selected semester
  const updateCoursesBySemester = async () => {
    if (!selectedSemester) return; // Handle no semester selected

    const filteredCoursesBySemester = courses.filter((course) => course.sem === selectedSemester);
    setCourses(filteredCoursesBySemester); // Update courses state with semester-filtered courses
  };

  // Effect to fetch data on component mount
  useEffect(() => {
    getStudents();
    getPrograms();
    getCourses();
  }, []); // Fetch data on component mount

  // Effect to update semesters and (optionally) filter courses when program changes
  useEffect(() => {
    updateSemesters();
  }, [selectedProgram]);

  // Effect to update courses when semester changes
  useEffect(() => {
    updateCoursesBySemester();
  }, [selectedSemester]);

  // Function to add a selected course to the course list
  const addCourse = () => {
    if (!selectedCourse) return;
    const newCourseList = [...courseList];
    newCourseList.push({ courseID: selectedCourse });
    setCourseList(newCourseList);
    setSelectedCourse(''); // Clear selected course after adding
  };

  // Function to remove a course from the selected course list
  const removeCourse = (index) => {
    const newCourseList = [...courseList];
    newCourseList.splice(index, 1);
    setCourseList(newCourseList);
  };

  // Function to handle program selection change
  const handleProgramChange = (event) => {
    setSelectedProgram(event.target.value);
  };

  // Function to handle semester selection change
  const handleChangeSemester = (event) => {
    setSelectedSemester(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || courseList.length === 0) {
      alert("Please select a student and add courses!");
      return;
    }

    // Prepare performance data object with course details as an array
    const performanceData = {
      studentID: selectedStudent,
      program: selectedProgram, // Optional if program name is stored
      courses: courseList.map((course) => course.courseID),
    };

    // Add performance data to Firestore (semesterPerformance collection)
    const performanceRef = collection(db, "tbl_semPerf");
    try {
      await addDoc(performanceRef, performanceData);
      alert("Performance data stored successfully!");
      // Clear the form after successful submission
      setSelectedStudent('');
      setSelectedProgram('');
      setSelectedCourse('');
      setCourseList([]);
    } catch (error) {
      console.error("Error storing performance:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // ... rest of your component (JSX for form, input fields, etc.)

  return (
    <form onSubmit={handleSubmit}>

      {students.length > 0 && (
        <>
            <label>Student:</label>
  <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
    {students.map((student) => (
      <option key={student.id} value={student.id}>
        {student.std_name}
      </option>
    ))}
  </select>
  </>
)}
      {/* Select program (optional) */}
      {programs.length > 0 && ( // Display program selection only if programs are available
        <>
          <label>Program:</label>
          <select value={selectedProgram} onChange={handleProgramChange}>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.programName}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedProgram && (
        <>
          <label>Semester:</label>
          <select value={selectedSemester} onChange={handleChangeSemester}>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
            {!semesters.length && <option disabled>No semesters available</option>}
          </select>
        </>
      )}

      {/* Select course */}
      <label>Course:</label>
      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
  {courses.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
      <button type="button" onClick={addCourse}>
        Add Course
      </button>

      {/* List of selected courses */}
      <h3>Selected Courses</h3>
      {courseList.length > 0 && (
        <ul>
          {courseList.map((course, index) => (
            <li key={index}>
              {/* Display course details (courseCode or courseName) based on your data structure */}
              {courses.find((c) => c.value === course.courseID)?.label}  {/* Find course label by
               {/* Find course label by ID and display courseCode or courseName */}
              {courses.find((c) => c.value === course.courseID)?.label}
              <button type="button" onClick={() => removeCourse(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="submit">Store Performance</button>
    </form>
  );
}
export default SemPerf;
