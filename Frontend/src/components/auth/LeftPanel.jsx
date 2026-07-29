import {
  FaRobot,
  FaFileAlt,
  FaMicrophone,
  FaChartBar,
} from "react-icons/fa";
import robot from "../../assets/images/robot.png";

function LeftPanel() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-100 p-6 md:p-10 xl:p-14">
        {/* Background Decorations */}

      <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-300 opacity-20 rounded-full blur-xl"></div>

      <div className="absolute top-1/2 left-5 w-5 h-5 bg-blue-400 rounded-full"></div>

      <div className="absolute top-32 right-40 w-4 h-4 bg-purple-300 rounded-full"></div>
      {/* Logo */}
      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <FaRobot className="text-white text-2xl" />
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-slate-900">
            InterviewIQ
          </h1>

          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">
            AI
          </span>
        </div>

      </div>

      <div className="mt-20">

        <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">

            Practice

            <span className="text-blue-600">
            {" "}Smarter.
            </span>

            <br />

            Get Hired

            <span className="text-blue-600">
            {" "}Faster.
            </span>

        </h2>

        <p className="text-gray-600 text-base md:text-lg xl:text-xl mt-8 leading-9">

            AI-powered mock interviews,
            real-time feedback,
            resume analysis,
            and personalized learning roadmap.

        </p>

      </div>

      <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-xl p-5 border border-gray-100">

            <img
                src={robot}
                alt="Robot"
                className="
                    mx-auto
                    w-48
                    md:w-64
                    xl:w-80
                    "
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

        <div className="mt-10 md:mt-16 space-y-5">

            <div className="flex gap-4">
                <div className="text-3xl"><FaFileAlt className="text-3xl text-blue-600" /></div>

                <div>
                <h3 className="font-semibold text-lg">
                    AI Resume Analysis
                </h3>

                <p className="text-gray-500">
                    Improve your resume and beat ATS.
                </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="text-3xl"><FaMicrophone className="text-3xl text-green-600" /></div>

                <div>
                <h3 className="font-semibold text-lg">
                    Mock Interviews
                </h3>

                <p className="text-gray-500">
                    Practice with an AI interviewer.
                </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="text-3xl"><FaChartBar className="text-3xl text-purple-600" /></div>

                <div>
                <h3 className="font-semibold text-lg">
                    Smart Feedback
                </h3>

                <p className="text-gray-500">
                    Get detailed reports after every interview.
                </p>
                </div>
            </div>

        </div>

    </div>
  );
}

export default LeftPanel;