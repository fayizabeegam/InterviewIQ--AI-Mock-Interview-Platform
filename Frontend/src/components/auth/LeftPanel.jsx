import {
  FaRobot,
  FaFileAlt,
  FaMicrophone,
  FaChartBar,
} from "react-icons/fa";
import robot from "../../assets/images/robot.png";

function LeftPanel() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-100 p-8 lg:p-10">
        {/* Background Decorations */}

        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-300 opacity-20 rounded-full blur-xl"></div>

        <div className="absolute top-1/2 left-5 w-5 h-5 bg-blue-400 rounded-full"></div>

        <div className="absolute top-32 right-40 w-4 h-4 bg-purple-300 rounded-full"></div>
        {/* Logo */}
        <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <FaRobot className="text-white text-2xl" />
            </div>

            <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-bold tracking-tight text-slate-900">
                InterviewIQ
            </h1>

            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                AI
            </span>
            </div>

        </div>

        <div className="mt-20">

            <h2 className="text-[18px] font-bold leading-[1.15] tracking-[-0.03em] text-slate-900">
                Practice
                <span className="text-blue-600"> Smarter.</span>
                <br />
                Get Hired
                <span className="text-blue-600"> Faster.</span>
            </h2>

            <p className="mt-6 max-w-[420px] text-[18px] leading-8 text-slate-600">

                AI-powered mock interviews,
                real-time feedback,
                resume analysis,
                and personalized learning roadmap.

            </p>

        </div>

        <div className="relative mx-auto mt-10 w-full max-w-[420px] overflow-hidden p-6">
            
            <img
                src={robot}
                alt="Robot"
                className="mx-auto w-[90%] object-contain"
            />

            {/* Card 1 */}

            <div className=" hidden lg:block absolute left-0 top-8 rounded-2xl bg-white shadow-lg p-4">

                <h4 className="font-semibold">
                    AI Feedback
                </h4>

                <p className="text-green-500 text-2xl font-bold">
                    86
                </p>

            </div>

            {/* Card 2 */}

            <div className="absolute right-0 top-20 rounded-2xl bg-white shadow-lg p-4">

                <h4 className="font-semibold">
                    ATS Score
                </h4>

                <p className="text-blue-600 text-2xl font-bold">
                    91
                </p>

            </div>

            {/* Card 3 */}

            <div className="absolute right-4 bottom-6 rounded-2xl bg-white shadow-lg p-4">

                <h4 className="font-semibold">
                    Interview
                </h4>

                <p className="text-purple-500 text-2xl font-bold">
                    +12%
                </p>

            </div>

        </div>

        <div className="mt-12 max-w-[260px] mx-auto space-y-8">
            <div className="flex items-start gap-4 max-w-[280px] mx-auto">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                    <FaFileAlt className="text-sm text-white" />
                </div>

                <div className="flex-1 text-left">
                    <h3 className="text-[16px] font-semibold text-slate-900">
                    AI Resume Analysis
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-slate-500">
                    Improve your resume and beat the ATS.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4 max-w-[280px] mx-auto">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500">
                    <FaMicrophone className="text-sm text-white" />
                </div>

                <div className="flex-1 text-left">
                    <h3 className="text-[16px] font-semibold text-slate-900">
                    Mock Interviews
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-slate-500">
                    Practice role-based interviews with AI interviewer.
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-4 max-w-[280px] mx-auto">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500">
                    <FaChartBar className="text-sm text-white" />
                </div>

                <div className="flex-1 text-left">
                    <h3 className="text-[16px] font-semibold text-slate-900">
                    Smart Feedback
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-slate-500">
                    Get detailed feedback and track your progress.
                    </p>
                </div>
            </div>
       

        </div>

    </div>
  );
}

export default LeftPanel;