import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query ,where} from 'firebase/firestore'; // Assuming you have Firebase configured
import { db } from '../../firebase'; // Replace with your Firebase configuration

const ViewFaculty = () => {
  const [faculties, setFaculties] = useState([]); // State for all students
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState(''); // Added state for search criteria
  const [isLoading, setIsLoading] = useState(false); // Added state for loading indicator
  const [fieldNames, setFieldNames] = useState({ fac_name: 'Name', fac_desgn: 'Designations',fac_exp:'Experience'}); // Field name mapping

  useEffect(() => {
    const fetchFaculties = async () => {
      setIsLoading(true); // Set loading indicator to true
      try {
        const facultiesCollection = collection(db, 'tbl_faculty'); // Replace with your collection name
        const q = query(facultiesCollection,orderBy('fac_exp','desc')); // Initial query for all students

        const querySnapshot = await getDocs(q);
        const facultyData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setFaculties(facultyData);
      } catch (error) {
        console.error(error);
        // Handle errors (e.g., display error message)
      } finally {
        setIsLoading(false); // Set loading indicator to false after fetching
      }
    };

    fetchFaculties();
  }, []); // Fetch all students on component mount

  const handleSearch = async () => {
    if (!searchTerm || !searchBy) {
      // Handle empty search term or criteria (optional: display error message)
      return;
    }

    setIsLoading(true); // Set loading indicator to true
    try {
      const facultiesCollection = (collection(db, 'tbl_faculty')); // Replace with your collection name
      let q = query(facultiesCollection,orderBy('fac_exp','desc')); // Initial query

      // Build query based on search criteria
      if (searchTerm && searchBy) {
        const searchField = searchBy.toLowerCase(); // Ensure consistent field name
        q = query(facultiesCollection, where(searchField, '==', searchTerm));
      }

      const querySnapshot = await getDocs(q);
      const facultyData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFaculties(facultyData);
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., display error message)
    } finally {
      setIsLoading(false); // Set loading indicator to false after fetching
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  return (
    <div className='admin-dashboard'>
      <h2>Faculties</h2>
      <div className='search-bar'>
        <input
          type='text'
          placeholder={`Search by ${fieldNames[searchBy] || 'Select a field'}`} // Dynamic placeholder based on searchBy
          value={searchTerm}
          onChange={handleSearchTermChange}
          disabled={isLoading}
        />
        <select value={searchBy} onChange={handleSearchByChange} disabled={isLoading}>
          <option value=''>Search By</option>
          {Object.keys(fieldNames).map((fieldName) => (
            <option key={fieldName} value={fieldName}>
              {fieldNames[fieldName]}
            </option>
          ))}
        </select>
        <button onClick={handleSearch} disabled={isLoading || !searchTerm || !searchBy}>
          Search
        </button>
        {isLoading && <p>Searching Faculties...</p>} {/* Display loading indicator */}
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Specializations</th>
            <th>Phone</th>
            <th>Experience</th>
            {/* Add more table headers for other student details */}
          </tr>
        </thead>
        <tbody>
        {faculties.map((faculty) => (
            <tr key={faculty.id}>
              <td>{faculty.fac_name}</td>
              <td>{faculty.fac_desgn}</td>
              <td>{faculty.fac_email}</td>
              <td>{faculty.fac_dob}</td>
              <td>{faculty.fac_gender}</td>
              <td>{faculty.fac_spec}</td>
              <td>{faculty.fac_phone}</td>
              <td>{faculty.fac_exp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isLoading && faculties.length === 0 && <p>No faculties found.</p>} {/* Display message for no results */}
    </div>
  );
};

export default ViewFaculty;
