import React, { useState,useEffect } from 'react'
import { db } from '../../../firebase'
import { getDocs,addDoc,collection,where,query, orderBy,onSnapshot,updateDoc,deleteDoc,doc,getDoc} from 'firebase/firestore'
import CourseDetailsModal from './CourseDetailsModal'
import UpdateCourseForm from './UpdateCourseForm'

const Course = () => {
    const[cCode,setCCode] = useState('')
    const[cName,setCName] = useState('')
    const[cType,setCType] = useState('')
    const[programs,setPrograms] = useState([])
    const[semester,setSemester] = useState('')
    const[cTC,setCTC] = useState('')
    const [selectedProgramId, setSelectedProgramId] = useState('');
    const [selectedProgram, setSelectedProgramName] = useState('');
    const [co1, setCO1] = useState('');
    const [co2, setCO2] = useState('');
    const [co3, setCO3] = useState('');
    const [co4, setCO4] = useState('');
    const [co5, setCO5] = useState('');
    const [courses, setCourses] = useState([]);

    const [viewMessage, setViewMessage] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null); 
    const [updateMessage, setUpdateMessage] = useState(null);
    
    const [courseCodes, setCourseCodes] = useState([]);
    const [selectedCourseCode, setSelectedCourseCode] = useState(''); // Selected course code
    const [isLoading, setIsLoading] = useState(false); // Added state for loading indicator

    useEffect(() => {
      const fetchCourseCodes = async () => {
        try {
          const coursesRef = collection(db, 'tbl_course');
          const q = query(coursesRef, orderBy('c_code', 'asc')); // Assuming 'tbl_course' collection
          const querySnapshot = await getDocs(q);
          const codes = querySnapshot.docs.map((doc) => doc.data().c_code); // Assuming 'c_code' field
          setCourseCodes(codes);
        } catch (error) {
          console.error('Error fetching course codes:', error);
        }
      };
  
      fetchCourseCodes(); // Call on component mount
    }, []);
    
    const handleCourseCodeChange = async (event) => {
      setSelectedCourseCode(event.target.value);
      if (event.target.value === '') { // Check for empty string
        setSelectedCourse(null); // Clear selected course state
        return;
      }
      setIsLoading(true); // Set loading indicator (assuming implemented)
      try {
        const courseRef = collection(db, 'tbl_course'); 
        const q = query(courseRef, where('c_code', '==', event.target.value)); 
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const courseData = querySnapshot.docs[0].data(); 
          setSelectedCourse(courseData);
        } else {
          console.error('Course not found:', event.target.value); // Error handling
          
        }
      } catch (error) {
        console.error('Error fetching course details:', error); // Error handling
      } finally {
        setIsLoading(false); // Clear loading indicator (assuming implemented)
      }
    };

    const handleProgramChange = (event) => {
       const selectedProgram = programs.find((program) => program.programId === event.target.value);
        setSelectedProgramId(event.target.value);
        setSelectedProgramName(selectedProgram.programName);
    };  
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "tbl_program"));
                const programData = querySnapshot.docs.map((doc) => ({
                    programId: doc.id,
                    programName: doc.data().program_name,
                }));
                setPrograms(programData);
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };
        fetchPrograms();
    }, []);

    const courseTypes = [
        { label: "PCC - Program Core Course", value: "PCC" },
        { label: "PAC - Program Activity Course", value: "PAC" },
        { label: "PSE-1 - Program Specific Elective Course 1", value: "PSE-1" },
        { label: "PSE-2 - Program Specific Elective Course 2", value: "PSE-2" },
        { label: "PSE-3 - Program Specific Elective Course 3", value: "PSE-3" },
        { label: "PSE-4 - Program Specific Elective Course 4", value: "PSE-4" },
        { label: "PSE-5 - Program Specific Elective Course 5", value: "PSE-5" },
        { label: "BC - Bridge Course", value: "BC" },
      ]
    const Sems = [
        { label: "I", value: "First" },
        { label: "II", value: "Second" },
        { label: "III", value: "Third" },
        { label: "IV", value: "Fourth" },
      ]

    const dbref = collection(db,"tbl_course")
    const courseReg = async () =>
    { 
        const matchCourseCode = query(dbref,where('c_code','==',cCode))
        
        
          if (!cCode || !cName || !cType || !selectedProgramId || !semester || !cTC || !co1 || !co2|| !co3|| !co4|| !co4 ) {
            alert("Please fill in all mandatory fields.");
            return;
          }

        try{
            
            const snapshot1 = await getDocs(matchCourseCode)
            const courseCodeMatchArray = snapshot1.docs.map((doc) => doc.data())
        
        if(courseCodeMatchArray.length >0){
            alert("This Course Code is aldready exists")
        }
        else
        {
            const courseOutcome = `CO1:${co1}; 
                                   CO2:${co2};
                                   CO3:${co3};
                                   CO4:${co4};
                                   CO5:${co5}`;
        await addDoc(dbref, {
            
            c_code: cCode,
            c_name: cName,
            c_type: cType,
            program: selectedProgram,
            semester: semester,
            c_TC: cTC,
            COs :courseOutcome,
           })
        }
    }
    catch(error){
        alert(error)
    }
    }

    const handleCOChange = (event) => {
        const { name, value } = event.target;
     
        switch (name) {
          
          case 'co1':
            setCO1(value);
            break;
          case 'co2':
            setCO2(value);
            break;
          case 'co3':
            setCO3(value);
            break;
          case 'co4':
            setCO4(value);
            break;
          case 'co5':
            setCO5(value);
            break;
          default:
            break;
        }
      }; 
    useEffect(() => {
        const fetchCourses = async () => {
          try {
            const coursesRef = collection(db, 'tbl_course');
            const q = query(coursesRef, orderBy('c_code', 'asc')); // Order by course code (ascending)
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const courseData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id, // Add course ID for table
              }));
              setCourses(courseData);
            });
            // Cleanup function to unsubscribe from snapshot listener on component unmount
            return () => unsubscribe();
          } catch (error) {
            console.error('Error fetching courses:', error);
          }
        };
    
        fetchCourses();
      }, []);

      const viewCourse = (course) => {
        setSelectedCourse(course);
        setShowModal(true); // Display course details in modal
      };

      const closeModal = () => {
        setShowModal(false);
      };

      const closeModal1 = () => {
        setShowModal1(false);
      };

      const updateCourse = async (updatedCourse) => {
        setUpdateMessage(null); // Clear previous message (optional)
        try {
          const courseRef = collection(db, 'tbl_course');
          const courseQuery = query(courseRef, where('c_code', '==', updatedCourse.c_code));
          const querySnapshot = await getDocs(courseQuery);
      
          if (querySnapshot.empty) {
            console.error('No matching document found for c_code:', updatedCourse.c_code);
            setUpdateMessage('Course not found. Update failed.');
            return;
          }
      
          // Assuming unique register_no, use the first document's reference
          const doc = querySnapshot.docs[0].ref; // **Ensure this is a reference object**
      
          await updateDoc(doc, updatedCourse);
          console.log('Course Details updated successfully!');
          setUpdateMessage('Course details updated successfully!');
        } catch (error) {
          console.error('Error updating Course details:', error);
          setUpdateMessage('An error occurred. Please try again.');
        }
      };

      const deleteCourse = async (courseCode) => {
        setDeleteMessage(null); // Clear previous message
        try {
          const courseRef = query(collection(db, 'tbl_course'), where('c_code', '==', courseCode)); // Query by c_code
          const snapshot = await getDocs(courseRef);
          if (snapshot.empty) {
            console.error('Course not found');
            setDeleteMessage('Course not found');
            return;
          }
          const doc = snapshot.docs[0]; // Assuming there's only one course with the code
          await deleteDoc(doc.ref);
          setDeleteMessage('Course deleted successfully!');
        } catch (error) {
          console.error('Error deleting course:', error);
          setDeleteMessage('An error occurred. Please try again.');
        }
      };

  return (
    <div className='container'>
        <div className='form'>
            <h2>Create Course</h2>
        <div className='box'>
            <input type = 'text' placeholder='Course Code' onChange={(e) => setCCode(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'text' placeholder='Course Name' onChange={(e) => setCName(e.target.value)}></input>
        </div>  
        <div className='dropdownbox'>
        
        <div className="box">
            <select value={cType} onChange={(e) => setCType(e.target.value)}>
                <option value=""> Select a Course Type</option>
                {courseTypes.map((courseType) => (
                <option key={courseType.value} value={courseType.value}>
                    {courseType.label}
                </option>
                ))}
            </select>
        </div>
        </div>
        <div className='box'>
            <select id="program" name="program" value={selectedProgramId} onChange={handleProgramChange}>
            <option value=""> Select a Program</option>
                {programs.map((program) => (
                  <option key={program.programId} value={program.programId}>
                  {program.programName}
                  </option>
                ))}
            </select>
        </div>
        <div className='box'>
        <label>Select Semester:</label>
                {Sems.map((sem) => (
                    <label key={sem.value}>
                        <input
                        type="radio"
                        name="gender"
                        value={sem.value}
                        onChange={(e) => setSemester(e.target.value)}
                        />
                        {sem.label}
                    </label>
                ))}
        </div>
        <div className='box'>
            <input type = 'number' placeholder='Total Credits' onChange={(e) => setCTC(e.target.value)}></input>
        </div>
        <div>
            <h3>Course Outcomes</h3>
                <label for="co1">Course Outcome-1:</label>
                <textarea id="co1" name="co1" onChange={handleCOChange}/>
                <br/>
                <label for="co2">Course Outcome-2:</label>
                <textarea id="co2" name="co2" onChange={handleCOChange} />
                <br/>
                <label for="co3">Course Outcome-3:</label>
                <textarea id="co3" name="co3" onChange={handleCOChange} />
                <br/>
                <label for="co4">Course Outcome-4:</label>
                <textarea id="co4" name="co4" onChange={handleCOChange}/>
                <br/>
                <label for="co5">Course Outcome-5:</label>
                <textarea id="co5" name="co5" onChange={handleCOChange}/>
        </div>
        <button onClick={courseReg}>Create</button>
        </div>
        {/*<select value={selectedCode} onChange={handleCodeChange}>
        <option value="">Select Course Code</option>
        {courseCodes.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>*/}
       <div className='search-bar'>
      <select value={selectedCourseCode} onChange={handleCourseCodeChange} disabled={isLoading}>
        <option value="">Select Course Code</option>
        {courseCodes.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      {isLoading && <p>Loading Course Details...</p>} {/* Display loading indicator */}
    </div>
    <div>
      <h2> Course Details</h2>
      <table border={1}>
      <thead>
    <tr>
      <th>Course Code</th>
      <th>Course Name</th>
      <th>Course Type</th>
      <th>Program</th>
      <th>Semester</th>
      <th>Total Credits</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {selectedCourse ? (
      <tr>
        <td>{selectedCourse.c_code}</td>
        <td>{selectedCourse.c_name}</td>
        <td>{selectedCourse.c_type}</td>
        <td>{selectedCourse.program}</td> 
        <td>{selectedCourse.semester}</td>
        <td>{selectedCourse.c_TC}</td>
        <td>
          <button onClick={() => viewCourse(selectedCourse)}>View</button>  {/* This button can be removed if using dropdown */}
          <button onClick={() => { setSelectedCourse(selectedCourse); setShowModal1(true); }}>Update</button>
          <button onClick={() => deleteCourse(selectedCourse.c_code)}>Delete</button>
        </td>
      </tr>
    ) : (
      courses?.length > 0 && (
        courses.map((course) => (
          <tr key={course.id}>
            <td>{course.c_code}</td>
            <td>{course.c_name}</td>
            <td>{course.c_type}</td>
            <td>{course.program}</td>
            <td>{course.semester}</td>
            <td>{course.c_TC}</td>
            <td>
              <button onClick={() => viewCourse(course)}>View</button>
              <button onClick={() => { setSelectedCourse(course); setShowModal1(true); }}>Update</button>
              <button onClick={() => deleteCourse(course.c_code)}>Delete</button>
            </td>
          </tr>
        ))
      )
    )}
    {courses?.length === 0 && (
      <tr>
        <td colSpan="7">No courses found.</td>
      </tr>
    )}
  </tbody>
      </table>
    </div>
      {deleteMessage && (
              <div className={`delete-message ${deleteMessage.includes('success') ? 'success' : 'error'}`}>
                {deleteMessage}
              </div>
            )}
  
      {showModal && selectedCourse && (
              <CourseDetailsModal course={selectedCourse} onClose={closeModal} />
            )}
      {showModal1 && selectedCourse && (
              <UpdateCourseForm  course={selectedCourse} onClose={closeModal1} onUpdate={updateCourse} />
            )}


    </div>
    
  )
}

export default Course