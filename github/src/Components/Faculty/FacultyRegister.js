import React, { useState } from 'react'
import { db } from '../../firebase'
import { Link} from 'react-router-dom'
import { getDocs,addDoc,collection,where,query } from 'firebase/firestore'


const FacultyRegister = () => {
    const[name,setName] = useState('')
    const[dob,setDOB] = useState('')
    const[facEmail,setFacEmail] = useState('')
    const[gender,setGender] = useState('')
    const[phone,setPhone] = useState('')
    const[desgn,setDesgn] = useState('')
    const[spec,setSpec] = useState('')
    const[spez,setSpez] = useState('')
    const[aM,setAM] = useState('')
    const[exp,setExp]= useState('')
    const[facPassword,setFacPassword] = useState('')
    const[facCPassword,setFacCPassword] = useState('')
    

    const validateEmail = (email) => {
        const emailRegex = /^([a-zA-Z0-9_\.]+)@ptuniv\.edu\.in$/;
        return emailRegex.test(email);
      };
    
      const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10}$/; // Matches 10 digits
      
        return phoneRegex.test(phone) 
      };

    const validatePasswordMatch = (event) => {
        if (event.target.value !== facPassword) {
          event.target.setCustomValidity("Passwords do not match!");
        } else {
          event.target.setCustomValidity("");
        }
      };
    
      
      const desgnOptions = [
        {label : 'HOD - PROFESSOR', value:'HOD(PROFESSOR)'},
        { label: 'Professor', value: 'PROFESSOR' }, // Assuming these values match database
        { label: 'Associate Professor', value: 'ASSOCIATE PROFESSOR' },
        { label: 'Assistant Professor', value: 'ASSISTANT PROFESSOR' },
        { label: 'Programmer', value: 'PROGRAMMER' },
      ];
    const options = [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
      ]


    const dbref = collection(db,"tbl_faculty")
    const facRegister = async () =>
    { 
        const matchEmail = query(dbref, where('fac_email','==',facEmail)) 

        if (!validateEmail(facEmail)) {
            alert("Please enter a valid email in the format @ptuniv.edu.in ");
            return;
          }
          
        if (!validatePhoneNumber(phone)) {
            alert("Check your Phone number,because Phone Number has 10 digits");
            return;
        }
        
          if (!name || !dob || !gender || !facEmail || !phone || !desgn || !spec || !facPassword || !facCPassword) {
            alert("Please fill in all mandatory fields.");
            return;
          }
      
          if (facPassword !== facCPassword) {
            alert("Passwords do not match!");
            return;
          }

        try{
            const snapshot = await getDocs(matchEmail)
            const emailMatchArray = snapshot.docs.map((doc) => doc.data())

        if(emailMatchArray.length > 0)
        {
            alert("This email is aldready exists")
        }

        else
        {
        await addDoc(dbref, {
            fac_name: name,
            fac_dob: dob,
            fac_gender: gender,
            fac_email: facEmail,
            fac_phone: phone,
            fac_desgn: desgn,
            fac_spec:spec,
            fac_spez:spez,
            fac_AM:aM,
            fac_exp:exp,
            fac_password: facPassword,
            fac_Cpassword: facCPassword})
            alert('Registered Successfully')
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
            <input type = 'text' placeholder='Enter your Name' onChange={(e) => setName(e.target.value)}></input>
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
            <input type = 'email' placeholder='Your PTU Email' onChange={(e) => setFacEmail(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'number' placeholder='Mobile Number' onChange={(e) => setPhone(e.target.value)}></input>
        </div>
        <div className='box'>
        <div className="box">
  <select value={desgn} onChange={(e) => setDesgn(e.target.value)}>
    {desgnOptions.map((designation) => (
      <option key={designation.value} value={designation.value}>
        {designation.label}
      </option>
    ))}
  </select>
</div>
        </div>
        <div className='box'>
            <input type = 'text' placeholder='Your Specifications' onChange={(e) => setSpec(e.target.value)}></input>
        </div>
        <div className='box'>
            <textarea type = 'text' placeholder='Your Specilizations' onChange={(e) => setSpez(e.target.value)}/>
        </div>
        <div className='box'>
            <textarea type = 'text' placeholder='Your Alma Mater' onChange={(e) => setAM(e.target.value)}/>
        </div>
        <div className='box'>
            <input type = 'number' placeholder='Your Experience' onChange={(e) => setExp(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'password' placeholder='Password' onChange={(e) => setFacPassword(e.target.value)}></input>
        </div>
        <div className='box'>
            <input type = 'password' placeholder='Confirm Password' 
            onChange={(e) => setFacCPassword(e.target.value)} 
            onInput={(e) => validatePasswordMatch(e)} required/>
        </div>
        <p>
            Aldready Have an Account <Link to = '/faculty/login'>Login</Link>
        </p>
        <button onClick={facRegister}>Register</button>
        </div>
    </div>
  )
}

export default FacultyRegister