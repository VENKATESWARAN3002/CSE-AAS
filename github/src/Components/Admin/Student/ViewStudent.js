import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc,orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import ProgramsList from './ProgramList';
import StudentsList from './StudentList';
import AcademicYearsList from './AcademicYearsList';

const ViewStudent = () => {
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [academicYears, setAcademicYears] = useState([]);

    const fetchPrograms = async () => {
        setIsLoading(true);
        try {
            const programsCollection = collection(db, 'tbl_program');
            const querySnapshot = await getDocs(programsCollection);
            const programData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setPrograms(programData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAcademicYears = async (programName) => {
        if (!programName) return [];

        try {
            const programQuery = query(collection(db, 'tbl_program'), where('program_name', '==', programName));
            const programQuerySnapshot = await getDocs(programQuery);

            if (programQuerySnapshot.empty) {
                console.warn(`Program with name "${programName}" not found.`);
                return [];
            }

            const programDoc = programQuerySnapshot.docs[0];
            const programRef = doc(db, 'tbl_program', programDoc.id);

            const academicYearsCollection = collection(programRef, 'academic_year');
            const academicYearsSnapshot = await getDocs(academicYearsCollection);

            const academicYearsData = academicYearsSnapshot.docs.map(doc => doc.data());

            setAcademicYears(academicYearsData);
        } catch (error) {
            console.error('Error fetching academic years:', error);
            return [];
        }
    };

    async function fetchStudentDetails(programName, academicYear) {
      try {
        // 1. Fetch students based on program and academic year (if provided)
        let studentQuery;
        if (academicYear) {
          
          studentQuery = query(
            collection(db, 'tbl_Student'),
            where('program', '==', programName),
            where('academic_year', '==', academicYear)
            // Add year filter if provided
          );
          
        } else {
          studentQuery = query(
            collection(db, 'tbl_Student'),
            where('program', '==', programName),
            
          );
        }
    
        
        const studentSnapshot = await getDocs(studentQuery);
    
        if (studentSnapshot.empty) {
          console.warn(`No students${academicYear ? ` matching year "${academicYear}"` : ''} found for program "${programName}".`);
          return [];
        }
    
        // 3. Extract student data directly from documents
        const studentData = studentSnapshot.docs.map(doc => doc.data());
        studentData.sort((a, b) => a.register_no - b.register_no);
        return studentData;
      } catch (error) {
        console.error('Error fetching student details:', error);
        return [];
      }
    }
    

    const handleProgramSelect = async (programData) => {
      setSelectedProgram(programData);
      setSelectedYear(null);
      setStudents([]);
      setIsLoading(true);
    
      let academicYears; // Declare a variable to hold fetched data
    
      try {
        academicYears = await fetchAcademicYears(programData.program_name);
      } catch (error) {
        console.error('Error fetching academic years:', error);
        academicYears = []; // Set to empty array in case of error
      } finally {
        setIsLoading(false);
      }
    
      if (academicYears && academicYears.length) {
        console.warn('No academic years found for this program.');
      }
      
        setIsLoading(false);
    };

    const handleYearSelect = async (year) => {
      setSelectedYear(year);
      // Add console logs to verify data fetching
      console.log('Selected program:', selectedProgram);
      console.log('Selected year:', year);
  
      const fetchedStudents = await fetchStudentDetails(selectedProgram.program_name, year);
      setStudents(fetchedStudents);
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    return (
      <div>
      <h1>View Student</h1>
      <ProgramsList
       onProgramSelect={(programData) => handleProgramSelect(programData)}
      />
      {selectedProgram && (
        <>
          <h3>Selected Program: {selectedProgram.program_name}</h3>
          {academicYears && academicYears.length > 0 && ( // Check for data before rendering
      <AcademicYearsList
        programData={selectedProgram}
        academicYears={academicYears}
        onYearSelect={(year) => handleYearSelect(year)}
      />
    )}
          {academicYears.length > 0 && (
            <StudentsList program={selectedProgram} academicYear={academicYears?.[0]} students={students} />
          )}
        </>
      )}
    </div>
    );
};

export default ViewStudent;