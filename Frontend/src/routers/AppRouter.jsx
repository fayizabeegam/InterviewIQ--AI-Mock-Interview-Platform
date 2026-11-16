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
import AdminUserOverview from "../pages/Admin/Users/AdminUsersOverview";

import AdminInterviews from "../pages/Admin/Interviews/AdminInterviews";
import AdminInterviewOverview from "../pages/Admin/Interviews/AdminInterviewOverview";
import AdminInterviewDetail from "../pages/Admin/Interviews/AdminInterviewDetails";

import AdminCodingOverview from "../pages/Admin/Coding/AdminCodingOverview";
import AdminAddQuestions from "../pages/Admin/Coding/AdminAddQuestions";
import AdminAllQuestions from "../pages/Admin/Coding/AdminAllQuestions";
import AdminBulkUpload from "../pages/Admin/Coding/AdminBulkupload";
import AdminCodingSubmissions from "../pages/Admin/Coding/AdminCodingSubmissions";
import AdminCodingReports from "../pages/Admin/Coding/AdminCodingReports";
import AdminUserDetail from "../pages/Admin/Users/AdminUsersDetails";
import AdminResumeOverview from "../pages/Admin/Resumes/AdminResumeOverview";
import AdminAllResumes from "../pages/Admin/Resumes/AdminAllResumes";
import AdminResumeDetails from "../pages/Admin/Resumes/AdminResumeDetails";
import AdminGeneralSettings from "../pages/Admin/Settings/AdminGeneralSettings";
import AdminProfileSettings from "../pages/Admin/Settings/AdminProfileSettings";


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

        <Route path="/admin/users/overview" element={<AdminUserOverview />}/>
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        

        <Route path="/admin/interviews/overview" element={<AdminInterviewOverview />}/>
        <Route path="/admin/interviews" element={<AdminInterviews />} />
        <Route path="/admin/interviews/:id" element={<AdminInterviewDetail />}/>

        <Route path="/admin/coding/overview" element={<AdminCodingOverview />}/>
        <Route path="/admin/coding/add-question" element={<AdminAddQuestions />}/>
        <Route path="/admin/coding/all-questions" element={<AdminAllQuestions />}/>
        <Route path="/admin/coding/bulk-upload" element={<AdminBulkUpload />}/>
        <Route path="/admin/coding/submissions" element={<AdminCodingSubmissions />}/>
        <Route path="/admin/coding/reports" element={<AdminCodingReports />}/>

        <Route path="/admin/resumes/overview" element={<AdminResumeOverview />} />
        <Route path="/admin/resumes/all" element={<AdminAllResumes />}/>
        <Route path="/admin/resumes/:id" element={<AdminResumeDetails />}/>

        <Route path="/admin/settings/general" element={<AdminGeneralSettings />}/>
        <Route path="/admin/settings/profile" element={<AdminProfileSettings />}/>









        

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;