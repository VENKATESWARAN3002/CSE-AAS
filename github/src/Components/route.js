import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentRegister from "./Student/StudentRegister";
import StudentLogin from "./Student/StudentLogin";
import FacultyLogin from "./Faculty/FacultyLogin";
import FacultyRegister from "./Faculty/FacultyRegister";
import FacultyDash from "./Faculty/FacultyDash";
import AdminLogin from "./Admin/AdminLogin";
import AdminDash from "./Admin/AdminDash";
import ViewStudent from "./Admin/Student/ViewStudent";
import ViewFaculty from "./Admin/ViewFaculty";
import Login from "./Login";
import ProgramsList from "./Admin/Student/ProgramList";
import Course from "./Admin/Course/Course";
import SemPerf from "./Student/semPerf";


const Rout = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path='/admin/login' element={<AdminLogin />} />
                <Route path="/admin/dash" element={<AdminDash/>}/>
                <Route path="/admin/viewStudent" element ={<ViewStudent/>}/>
                <Route path="/admin/viewFaculty" element ={<ViewFaculty/>}/>
                <Route path="/admin/viewStudentPW" element ={<ProgramsList/>}/>
                <Route path="/admin/semPerf" element = {<SemPerf/>}/>
                <Route path="/admin/course" element = {<Course/>}/>
                <Route path='/faculty/login' element={<FacultyLogin />} />
                <Route path='/faculty/register' element={<FacultyRegister />} />
                <Route path="/faculty/dash" element={<FacultyDash/>}/>
                <Route path='/student/login' element={<StudentLogin />} />
                <Route path='/student/register' element={<StudentRegister />} />
            </Routes>
        </>
    )
}

export default Rout;