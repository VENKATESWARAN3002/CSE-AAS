import React, { useState } from "react";
import { db } from '../../firebase';
import { Link } from "react-router-dom";
import {IonIcon} from '@ionic/react'
import { mailOutline,lockClosedOutline } from 'ionicons/icons'
import {getDocs,collection,where,query} from 'firebase/firestore'
import logo from '../ptu-logo.png'
import '../Login.css'
const StudentLogin = () =>{
    const [stdEmail,setStdEmail] = useState('')
    const [stdPassword,setStdPassword] = useState('')
    const login = async () =>
    {
        const dbref = collection(db, 'tbl_Student')
        try{
            const emailMatch = query(dbref,where('std_email', '==',stdEmail))
            const passwordMatch = query(dbref,where('std_password','==',stdPassword))
            const emailSnapshot = await getDocs(emailMatch)
            const emailArray = emailSnapshot.docs.map((doc) => doc.data())
            const passwordSnapshot = await getDocs(passwordMatch)
            const passwordArray = passwordSnapshot.docs.map((doc) => doc.data())
            if(emailArray.length > 0 && passwordArray.length > 0)
            {
                alert('Login Successfully')
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
        <section>
            <div className="form-box">
                <div class="form-value">
                    <div class="main-icon">
                        <img src={logo}/>
                    </div>
                    <form>
                        <h2>Login</h2>
                        <div className="inputbox"> <IonIcon icon={mailOutline}/>
                            <input type="email"  onChange={(e) => setStdEmail(e.target.value)}/><label>Email</label> 
                        </div>
                        <div className="inputbox"> <IonIcon icon={lockClosedOutline}/>
                            <input type="password"  onChange={(e) => setStdPassword(e.target.value)}/><label>Password</label> 
                        </div>
                        <button className ="btn" onClick={login}>Login</button>
                        <div className="register">
                        <p>Are u new Student? <Link to = '/student/register'>Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        </>
    )
}

export default StudentLogin