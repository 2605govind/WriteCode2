import { Route, Routes, Navigate } from 'react-router'
import './App.css'
import RegisterPage from './pages/authPages/RegisterPage.jsx'
import LoginPage from './pages/authPages/LoginPage.jsx'
import OTPVerificationPage from './pages/authPages/OtpVerificationPage.jsx'
import ForgotPasswordPage from './pages/authPages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/authPages/ResetPasswordPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './slice/authSlice.js'
import ProblemPage from './pages/ProblemPage.jsx'
import AdminProblemDelete from './components/AdminComponents/AdminProblemDelete.jsx'
import AdminProblemCreate from './components/AdminComponents/AdminProblemCreate.jsx'
import Admin from './pages/AdminPages/Admin.jsx'
import CourseInputPage from './pages/AdminPages/CourseInputPage.jsx'
import CourseDetailsPage from './pages/CourseDetailsPage.jsx'
import { StyledEngineProvider } from '@mui/material/styles';
import CourseDeletePage from './pages/AdminPages/CourseDeletePage.jsx'

function App() {
  // const {isAuthenticated} = useSelector((state) => state.auth);
  const {isAuthenticated, user, loading} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  return (
   <div>
     <StyledEngineProvider injectFirst>
    <Routes>
      <Route path='/' element={ isAuthenticated ? <HomePage/> : <Navigate to={'/register'}/>}></Route>

      <Route path='/register'  element={isAuthenticated?<Navigate to="/" />:<RegisterPage/>}></Route>
      <Route path='/login' element={isAuthenticated ? <Navigate to="/" />:<LoginPage/>}></Route>
      <Route path='/register/otpverify' element={<OTPVerificationPage/>} ></Route>
      <Route path='/forgotpassword' element={<ForgotPasswordPage/>} ></Route>
      <Route path='/reset-password' element={<ResetPasswordPage/>} ></Route>

      <Route path='/coursedetails/:courseId' element={ isAuthenticated ? <CourseDetailsPage/> : <Navigate to={'/register'}/>}></Route>
     


      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminProblemCreate /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminProblemDelete /> : <Navigate to="/" />} />
      <Route path="/admin/courseinput" element={isAuthenticated && user?.role === 'admin' ? <CourseInputPage /> : <Navigate to="/" />} />
      <Route path="/admin/coursedelete" element={isAuthenticated && user?.role === 'admin' ? <CourseDeletePage /> : <Navigate to="/" />} />
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>


    </Routes>
    </StyledEngineProvider>
   </div>
  )
}

export default App
