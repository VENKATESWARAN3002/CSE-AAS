import React, { useState } from "react";
import { db } from '../../firebase';
import { Link } from "react-router-dom";
import {getDocs,collection,where,query} from 'firebase/firestore'
import { useNavigate } from "react-router-dom";

const FacultyLogin = () =>{
    const [facEmail,setFacEmail] = useState('')
    const [facPassword,setFacPassword] = useState('')
    const navigate = useNavigate()

    const login = async () =>
    {
        const dbref = collection(db, 'tbl_faculty')
        try{
            const emailMatch = query(dbref,where('fac_email', '==',facEmail))
            const passwordMatch = query(dbref,where('fac_password','==',facPassword))
            const emailSnapshot = await getDocs(emailMatch)
            const emailArray = emailSnapshot.docs.map((doc) => doc.data())
            const passwordSnapshot = await getDocs(passwordMatch)
            const passwordArray = passwordSnapshot.docs.map((doc) => doc.data())
            if(emailArray.length > 0 && passwordArray.length > 0)
            {
                alert('Login Successfully')
                navigate('/faculty/dash');
            }
            else{
                alert("Check your Email or Password")
            }
        }
        catch(error){
         alert(error)
        }
    }   
    return(
        <>
        <div className="form">
            <h2>Login</h2>
            <div className="box">
                <input type="email" placeholder="E-mail" onChange={(e) => setFacEmail(e.target.value)}></input>
            </div>
            <div className="box">
                <input type="password" placeholder="Password" onChange={(e) => setFacPassword(e.target.value)}></input>
            </div>
            <button onClick={login}>Login</button>
            <p>
            Aldready Have an Account <Link to = '/faculty/register'>Register</Link>
        </p>
         </div>
        </>
    )
}

export default FacultyLogin