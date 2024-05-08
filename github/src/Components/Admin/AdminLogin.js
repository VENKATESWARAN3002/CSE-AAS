import React, { useState } from "react";
import { db } from "../../firebase";
import {getDocs,collection,where,query} from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
const AdminLogin = () =>{
    const [adminEmail,setAdminEmail] = useState('')
    const [adminPassword,setAdminPassword] = useState('')
    const navigate = useNavigate();
    const login = async () =>
    {
        
        const dbref = collection(db, 'tbl_admin')
        try{
            const emailMatch = query(dbref,where('admin_email', '==',adminEmail))
            const passwordMatch = query(dbref,where('admin_password','==',adminPassword))
            const emailSnapshot = await getDocs(emailMatch)
            const emailArray = emailSnapshot.docs.map((doc) => doc.data())
            const passwordSnapshot = await getDocs(passwordMatch)
            const passwordArray = passwordSnapshot.docs.map((doc) => doc.data())
            if(emailArray.length > 0 && passwordArray.length > 0)
            {
                alert('Login Successfully')
                navigate(`/admin/dash`); // Redirect based on user type
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
                <input type="email" placeholder="E-mail" onChange={(e) => setAdminEmail(e.target.value)}></input>
            </div>
            <div className="box">
                <input type="password" placeholder="Password" onChange={(e) => setAdminPassword(e.target.value)}></input>
            </div>
            <button onClick={login}>Login</button>
         </div>
        </>
    )
}

export default AdminLogin