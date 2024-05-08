import React, { useState,useEffect,useRef } from 'react'
import { db } from '../../firebase'
import { Link} from 'react-router-dom'
import { getDocs,addDoc,collection,where,query } from 'firebase/firestore'


const StudentRegister = () => {
    const[regno,setRegNo] = useState('')
    const[name,setName] = useState('')
    const[dob,setDOB] = useState('')
    const[stdEmail,setStdEmail] = useState('')
    const[gender,setGender] = useState('')
    const[phone,setPhone] = useState('')
    const[stdPassword,setStdPassword] = useState('')
    const[stdCPassword,setStdCPassword] = useState('')
    const [doorNo, setDoorNo] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [programs, setPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState('');
    const [selectedProgram, setSelectedProgramName] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    
    const years = [...Array(10)].map((_, i) => new Date().getFullYear() - i); // Generate past 10 years

    // Functions for fetching programs, validation, etc.
    // ... existing functions ... (e.g., validateEmail, validatePhoneNumber)
  
    const handleStartYearChange = (event) => {
      setStartYear(event.target.value);
    };
  
    const handleEndYearChange = (event) => {
      setEndYear(event.target.value);
    };



    const validateEmail = (email) => {
        const emailRegex = /^([a-zA-Z0-9_\.]+)@ptuniv\.edu\.in$/;
        return emailRegex.test(email);
      };
    
      const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10}$/; // Matches 10 digits
      
        return phoneRegex.test(phone) 
      };

      const doorNoInput = useRef(null); // Reference to the input field

      useEffect(() => {
        const handleKeyDown = (event) => {
          const allowedChars = /^[0-9\/]+$/; // Allow only digits and slashes
          const isDeleteKey = event.key === 'Backspace' || event.key === 'Delete';
          if (!allowedChars.test(event.key) && !isDeleteKey) {
            event.preventDefault(); // Prevent invalid key press (alphabets and other characters)
          }
        };
      
        const inputElement = doorNoInput.current;
        if (inputElement) {
          inputElement.addEventListener('keydown', handleKeyDown);
      
          return () => {
            inputElement.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
          };
        }
      }, []);
    const handleProgramChange = (event) => {
       const selectedProgram = programs.find((program) => program.programId === event.target.value);
        setSelectedProgramId(event.target.value);
        setSelectedProgramName(selectedProgram.programName);
    };
   
    const handleAddressChange = (event) => {
      const { name, value } = event.target;
   
      switch (name) {
        
        case 'doorno':
          setDoorNo(value);
        case 'streetAddress':
          setStreetAddress(value);
          break;
        case 'city':
          setCity(value);
          break;
        case 'state':
          setState(value);
          break;
        case 'pincode':
          setPincode(value);
          break;
        default:
          break;
      }
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

    const validatePasswordMatch = (event) => {
        if (event.target.value !== stdPassword) {
          event.target.setCustomValidity("Passwords do not match!");
        } else {
          event.target.setCustomValidity("");
        }
      };
    
 
    const options = [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
      ]

    const dbref = collection(db,"tbl_Student")
    const stdRegister = async () =>
    { 
        const matchRegNo = query(dbref,where('register_no','==',regno))
        const matchEmail = query(dbref, where('std_email','==',stdEmail)) 
        
       

        if (!validateEmail(stdEmail)) {
            alert("Please enter a valid email in the format @ptuniv.edu.in or @ptuniv.edu.in");
            return;
          }
          
        if (!validatePhoneNumber(phone)) {
            alert("Check your Phone number,because Phone Number has 10 digits");
            return;
        }
        
          if (!regno || !name || !dob || !gender || !selectedProgramId || !stdEmail || !phone || !stdPassword || !stdCPassword) {
            alert("Please fill in all mandatory fields.");
            return;
          }
      
          if (stdPassword !== stdCPassword) {
            alert("Passwords do not match!");
            return;
          }

        try{
            const snapshot = await getDocs(matchEmail)
            const emailMatchArray = snapshot.docs.map((doc) => doc.data())

            const snapshot1 = await getDocs(matchRegNo)
            const regNoMatchArray = snapshot1.docs.map((doc) => doc.data())
        
        if(regNoMatchArray.length >0){
            alert("This Register number is aldready exists")
        }
        if(emailMatchArray.length > 0)
        {
            alert("This email is aldready exists")
        }

        else
        {
          const academicYear = `${startYear}-${endYear}`;
          const fullAddress = `No:${doorNo} ${streetAddress}, ${city}, ${state} - ${pincode}`;
        await addDoc(dbref, {
            register_no: regno,
            std_name: name,
            std_dob: dob,
            std_gender: gender,
            program: selectedProgram,
            academic_year:academicYear,
            address: fullAddress,
            std_email: stdEmail,
            std_phone: phone,
            std_password: stdPassword,
            std_Cpassword: stdCPassword})
        }
    }
    catch(error){
        alert(error)
    }
    }

  return (
    <div className='container'>
        <div className='form'>
            <h2>Register</h2>
        <div className='box'>
            <input type = 'number' placeholder='Register Number' onChange={(e) => setRegNo(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'text' placeholder='Name' onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'date' placeholder='Date of birth' onChange={(e) => setDOB(e.target.value)}></input>
        </div>
        
        <div className='dropdownbox'>
        <label>Select Gender:</label>
  <div>
    {options.map((option) => (
      <label key={option.value}>
        <input
          type="radio"
          name="gender"
          value={option.value}
          onChange={(e) => setGender(e.target.value)}
        />
        {option.label}
      </label>
    ))}
  </div>
        </div>
        <div className='box'>
            <input type = 'email' placeholder='Your PTU Email' onChange={(e) => setStdEmail(e.target.value)}></input>
        </div>
        <div className='box'>
            <select id="program" name="program" value={selectedProgramId} onChange={handleProgramChange}>
            <option value=""> Choose a Program</option>
                {programs.map((program) => (
                  <option key={program.programId} value={program.programId}>
                  {program.programName}
                  </option>
                ))}
            </select>
        </div>
        <div className="row mb-3">
 
    <label htmlFor="Academic Year " className="form-label">Academic Year </label>
    <select className="form-select" id="startYear" value={startYear} onChange={handleStartYearChange} required>
    <option value="">-- Select Start Year --</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
 
    <label htmlFor="to" className="form-label">To</label>
    <select className="form-select" id="endYear" value={endYear} onChange={handleEndYearChange} required>
    <option value="">-- Select End Year --</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>

</div>
<h3>Address</h3>
<label for="doorno">Door No:</label>
  <input type="text" id="doorno" name="doorno" onChange={handleAddressChange} ref={doorNoInput}  />

  <label for="streetAddress">Street Address:</label>
  <input type="text" id="streetAddress" name="streetAddress" onChange={handleAddressChange} />

  <label for="city">City:</label>
  <input type="text" id="city" name="city" onChange={handleAddressChange} />

  <label for="state">State:</label>
  <input type="text" id="state" name="state" onChange={handleAddressChange}/>

  <label for="pincode">Pincode:</label>
  <input type="text" id="pincode" name="pincode" onChange={handleAddressChange}/>
   
        <div className='box'>
            <input type = 'number' placeholder='Mobile Number' onChange={(e) => setPhone(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'password' placeholder='Password' onChange={(e) => setStdPassword(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'password' placeholder='Confirm Password' 
            onChange={(e) => setStdCPassword(e.target.value)} 
            onInput={(e) => validatePasswordMatch(e)} required/>
        </div>
        <p>
            Aldready Have an Account <Link to = '/student/login'>Login</Link>
        </p>
        <button onClick={stdRegister}>Register</button>
        </div>
    </div>
  )
}

export default StudentRegister