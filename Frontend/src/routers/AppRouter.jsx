import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import UserProfile from "../pages/Profile/UserProfile";
import EditProfile from "../pages/Profile/EditProfile";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import ChangePassword from "../pages/Auth/ChangePassword";
import Home from "../pages/Home/Home";
import ResumeAnalyzer from "../pages/Resume/ResumeAnalyzer";
import JobMatcher from "../pages/Job/JobMatcher";
import JobMatchResult from "../pages/Job/JobMatchResult";
import AIInterview from "../pages/Interview/AIInterview";
import InterviewSession from "../pages/Interview/InterviewSession";
import InterviewComplete from "../pages/Interview/InterviewComplete";
import InterviewReport from "../pages/Interview/InterviewReport";
import PersonalizedRoadmap from "../pages/Roadmap/PersonalizedRoadmap";
import CodingPractice from "../pages/Coding/CodingPractice";
import CodingProblem from "../pages/Coding/CodingProblem";

import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminUsers from "../pages/Admin/Users/AdminUsers";
import AdminInterviews from "../pages/Admin/Interviews/AdminInterviews";


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/user-profile/edit" element={<EditProfile />}/>
      
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword /> }/>

        <Route path="/resume-analyzer" element={<ResumeAnalyzer />}/>

        <Route path="/job-matcher" element={<JobMatcher />} />
        <Route path="/job-matcher/result" element={<JobMatchResult />}/>

        <Route path="/ai-interview" element={<AIInterview />}/>
        <Route path="/ai-interview/session" element={<InterviewSession />}/>
        <Route path="/ai-interview/complete" element={<InterviewComplete />}/>
        <Route path="/ai-interview/report" element={<InterviewReport />}/>
        
        <Route path="/roadmap" element={<PersonalizedRoadmap />}/>
        <Route path="/coding-practice" element={<CodingPractice />}/>
        <Route path="/coding-practice/:questionId" element={<CodingProblem />}/>


        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/interviews" element={<AdminInterviews />} />






        

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;