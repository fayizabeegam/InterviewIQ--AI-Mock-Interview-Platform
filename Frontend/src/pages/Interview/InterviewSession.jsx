import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Lightbulb,
  Mic,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";

import robotImage from "../../assets/images/interviewRobo.png";
import api from "../../services/api";
import { getInterviewDetail } from "../../services/interviewService";
import { evaluateInterviewAnswer } from "../../services/ai/answerEvaluator";


const InterviewSession = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const interviewId = location.state?.interviewId;

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("Authentication required.");
        }

        if (!interviewId) {
          throw new Error("Interview ID is missing.");
        }

        const response = await getInterviewDetail(
          interviewId,
          token
        );

        const data =
          response.data?.data ??
          response.data;

        setInterview(data);
      } catch (error) {
        console.error("Interview loading error:", error);

        setError(
          error.response?.data?.detail ||
          error.message ||
          "Unable to load interview."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [interviewId]);


  const questions = interview?.questions || [];

  const totalQuestions = questions.length;

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState({});

  const [warning, setWarning] = useState("");

  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [pendingFollowUp, setPendingFollowUp] = useState("");
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [interviewerResponse, setInterviewerResponse] = useState("");

  const MAX_FOLLOW_UPS_PER_QUESTION = 2;
  const MAX_FOLLOW_UPS_PER_INTERVIEW = 5;

  const [followUpsPerQuestion, setFollowUpsPerQuestion] = useState({});
  const [totalFollowUps, setTotalFollowUps] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isMuted, setIsMuted] = useState(false);

  const [interviewerVoice, setInterviewerVoice] = useState("male");
  const [conversationStage, setConversationStage] = useState("ready");

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [closingSpeechFinished, setClosingSpeechFinished] = useState(false);

  const TOTAL_INTERVIEW_TIME = 45 * 60;

  const [timeLeft, setTimeLeft] = useState(TOTAL_INTERVIEW_TIME);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isInterviewStarted || isTimeUp) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isInterviewStarted, isTimeUp, timeLeft]);

  useEffect(() => {
    if (!loading && interview && !isInterviewStarted) {
      setIsInterviewStarted(true);
    }
  }, [loading, interview, isInterviewStarted]);


  const question = isFollowUp
  ? followUpQuestion
  : questions[currentQuestion - 1]?.question || "";


  const progress =
    (currentQuestion / totalQuestions) * 100;

  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userName =
    user.first_name ||
    user.name?.split(" ")[0] ||
    "Candidate";


  // =====================================================
  // SAVE CURRENT ANSWER
  // =====================================================

  const saveCurrentAnswer = () => {

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: answer,
    }));

  };



  const handleVoiceRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(
          audioChunksRef.current,
          { type: "audio/webm" }
        );

        console.log("Recorded audio:", audioBlob);

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        setIsRecording(false);

        try {
          const token = localStorage.getItem("access_token");

          if (!token) {
            throw new Error("Authentication required.");
          }

          const formData = new FormData();

          formData.append(
            "audio",
            audioBlob,
            `answer-${currentQuestion}.webm`
          );

          const response = await api.post(
            `interviews/${interviewId}/transcribe/`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data;
          console.log("Whisper transcript:", data.transcript);

          setAnswer((previous) =>
            `${previous} ${data.transcript}`
              .trim()
              .slice(0, 2000)
          );

        } catch (error) {
          console.error("Transcription error:", error);

          setError(
            error.message || "Unable to transcribe your answer."
          );
        }
      };

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);

      setError(
        "Unable to access your microphone. Please allow microphone permission."
      );
    }
  };



  // ==================================================
  // puter voice
  // =================================================
  
  
  const interviewerAudioRef = useRef(null);
  const preparedIntroductionRef = useRef(null);


  const speakWithAI = async (text) => {
    if (!text?.trim() || isMuted) return;

    try {
      if (interviewerAudioRef.current) {
        interviewerAudioRef.current.pause();
        interviewerAudioRef.current.currentTime = 0;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/interviews/tts/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ text: text.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error(`Piper TTS failed: ${response.status}`);
      }

      if (isMuted) return;

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      interviewerAudioRef.current = audio;
      audio.playbackRate = 0.95;

      await new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error("Piper audio playback failed"));
        };

        audio.play().catch(reject);
      });
    } catch (error) {
      console.error("Local Piper TTS error:", error);
      throw error;
    }
  };


  const prepareIntroductionAudio = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/interviews/tts/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            text: getIntroductionText(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to prepare introduction audio.");
      }

      return await response.blob();
    } catch (error) {
      console.error("Introduction audio preparation failed:", error);
      return null;
    }
  };



// ==================================================


  

  const handleMuteToggle = () => {
    const audio = interviewerAudioRef.current;

    if (isMuted) {
      setIsMuted(false);

      if (audio) {
        audio.play().catch((error) => {
          console.error("Audio resume error:", error);
        });
      }
    } else {
      setIsMuted(true);

      if (audio) {
        audio.pause();
      }
    }
  };



  const speakQuestion = async (
    text,
    isFollowUpQuestion = false
  ) => {
    try {
      const speechText = isFollowUpQuestion
        ? `I have a follow-up question for you. ${text}`
        : `Question ${currentQuestion}. ${text}`;

      await speakWithAI(speechText);
    } catch (error) {
      console.error("AI question speech error:", error);
    }
  };



  const speakInterviewerResponse = async (text) => {
    if (!text?.trim() || isMuted) return;

    try {
      await speakWithAI(text);
    } catch (error) {
      console.error("AI interviewer response speech error:", error);
    }
  };


 
  const getIntroductionText = () => {
    return (
      `Hello ${userName}, and welcome to your AI interview. ` +
      "My name is Amy, and I will be your interviewer today. " +
      "I am happy to help you practise and demonstrate your skills. " +
      "Please take your time and answer each question as clearly as you can. " +
      "There is no need to rush. " +
      "Let's begin with the first question."
    );
  };


  const speakIntroduction = async () => {
    try {
      if (isMuted) return;

      const preparedUrl = preparedIntroductionRef.current;

      if (preparedUrl) {
        const audio = new Audio(preparedUrl);

        interviewerAudioRef.current = audio;
        audio.playbackRate = 0.95;

        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = () =>
            reject(new Error("Introduction audio playback failed"));

          audio.play().catch(reject);
        });

        return;
      }

      // Fallback if the prepared audio isn't ready yet.
      await speakWithAI(getIntroductionText());
    } catch (error) {
      console.error("AI introduction speech error:", error);
    }
  };


  
  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = async () => {
    if (conversationStage === "ready") {
      setAnswer("");
      setConversationStage("question");
      return;
    }
    if (isEvaluating || isRecording) return;

    if (!answer.trim()) {
      setWarning("Please provide an answer before continuing.");
      return;
    }
    setWarning("");

    try {
      setIsEvaluating(true);
      setError("");

      window.speechSynthesis.cancel();

      const currentAnswer = answer.trim();

      // Evaluate the current main or follow-up question.
      const evaluationQuestion =
        conversationStage === "followup"
          ? followUpQuestion
          : question;

      
      const result = await evaluateInterviewAnswer({
        question: evaluationQuestion,
        answer: currentAnswer,
        interviewType: interview?.interview_type,
        difficulty: interview?.difficulty,
        experienceLevel:
          interview?.experience_level ||
          (
            interview?.difficulty === "EASY"
              ? "fresher"
              : interview?.difficulty === "HARD"
                ? "senior"
                : "junior"
          ),
      });


      console.log("Answer evaluation:", result);

      const updatedAnswer = {
        answer: currentAnswer,
        evaluation: result,
      };

      // Preserve the answer and its evaluation.
      const updatedAnswers = {
        ...answers,
        [currentQuestion]: {
          ...(answers[currentQuestion] || {}),
          ...updatedAnswer,
        },
      };

      setAnswers(updatedAnswers);

      const response =
        result.interviewer_response?.trim() || "";

      const currentFollowUpCount =
        followUpsPerQuestion[currentQuestion] || 0;

      const canAskFollowUp =
        currentFollowUpCount < MAX_FOLLOW_UPS_PER_QUESTION &&
        totalFollowUps < MAX_FOLLOW_UPS_PER_INTERVIEW;

      const nextFollowUp =
        result.needs_follow_up &&
        result.follow_up_question?.trim() &&
        canAskFollowUp
          ? result.follow_up_question.trim()
          : "";

      // Clear the candidate's answer.
      setAnswer("");

      // Store the follow-up without displaying it yet.
      setPendingFollowUp(nextFollowUp);
      setFollowUpQuestion("");
      setIsFollowUp(false);

      // Display ONLY the interviewer response.
      setInterviewerResponse(
        response || "Thank you for your answer."
      );
      setConversationStage("response");

      // Speak the entire response and wait for speech to finish.
      if (!isMuted && response) {
        await speakInterviewerResponse(response);
      }

      // The complete response has now been read.
      // Remove it before displaying any follow-up.
      setInterviewerResponse("");

      // If a follow-up is needed, display and read it separately.
      if (nextFollowUp) {
        setFollowUpsPerQuestion((previous) => ({
          ...previous,
          [currentQuestion]:
            (previous[currentQuestion] || 0) + 1,
        }));

        setTotalFollowUps((previous) => previous + 1);
        setFollowUpQuestion(nextFollowUp);
        setPendingFollowUp("");
        setIsFollowUp(true);
        setConversationStage("followup");

        if (!isMuted) {
          await speakQuestion(nextFollowUp,true);
        }

        // Wait for the candidate to answer.
        return;
      }

      // No follow-up: advance to the next main question.
      setFollowUpQuestion("");
      setPendingFollowUp("");
      setIsFollowUp(false);
      setConversationStage("question");

      if (currentQuestion < totalQuestions) {
        setCurrentQuestion((previous) => previous + 1);
        return;
      }

      // All main questions are complete.
      setConversationStage("completed");
      setClosingSpeechFinished(false);

      const closingSpeech =
        "Thank you for completing the interview. I appreciate the time and effort you put into your answers. You can now finish the interview and review your results.";

      setInterviewerResponse(closingSpeech);
      await speakInterviewerResponse(closingSpeech);
      setClosingSpeechFinished(true);
    } catch (error) {
      console.error("Answer evaluation error:", error);

      setError(
        error.message ||
        "Unable to evaluate your answer. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };


  useEffect(() => {
    if (!question) return;

    // Step 1: Introduction and readiness prompt
    if (conversationStage === "ready") {
      const timer = setTimeout(async () => {
        if (isMuted) return;

        // Introduce the interviewer
        await speakIntroduction();

        // Pause after the introduction
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );

        // Ask the candidate to start
        await speakWithAI(
          "Before we begin, are you ready to start the interview? Please click the I'm Ready button below to begin."
        );
      }, 800);

      return () => clearTimeout(timer);
    }

    // Step 2: Do not speak while showing evaluation responses
    if (
      conversationStage === "response" ||
      conversationStage === "followup" ||
      conversationStage === "completed"
    ) {
      return;
    }

    // Step 3: After the candidate clicks "I'm Ready",
    // announce the question heading and read the question
    const timer = setTimeout(async () => {
      if (isMuted) return;

      await speakQuestion(question);
    }, 800);

    return () => clearTimeout(timer);
  }, [
    question,
    currentQuestion,
    conversationStage,
    isFollowUp,
  ]);



  useEffect(() => {
    if (loading || !interview) return;

    let cancelled = false;

    const prepareAudio = async () => {
      const audioBlob = await prepareIntroductionAudio();

      if (!cancelled && audioBlob) {
        preparedIntroductionRef.current = URL.createObjectURL(audioBlob);
        console.log("Introduction audio prepared.");
      }
    };

    prepareAudio();

    return () => {
      cancelled = true;
    };
  }, [loading, interview, userName]);



  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {

    if (currentQuestion === 1) {
      return;
    }

    const previousQuestion =
      currentQuestion - 1;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: answer,
    }));

    setCurrentQuestion(previousQuestion);

    setAnswer(
      typeof answers[previousQuestion] === "string"
        ? answers[previousQuestion]
        : answers[previousQuestion]?.answer || ""
    );

  };


  // =====================================================
  // SELECT QUESTION
  // =====================================================

  const handleQuestionSelect = (number) => {

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: answer,
    }));

    setCurrentQuestion(number);

    setAnswer(
      typeof answers[number] === "string"
        ? answers[number]
        : answers[number]?.answer || ""
    );

  };


  if (loading) {
    return (
      <UserLayout>
        <Container>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm font-medium text-slate-500">
              Loading interview...
            </p>
          </div>
        </Container>
      </UserLayout>
    );
  }

  const handleStopInterview = () => {
    const confirmed = window.confirm(
      "Are you sure you want to stop the interview?"
    );

    if (confirmed) {
      interviewerAudioRef.current?.pause();
      window.speechSynthesis.cancel();
      navigate(-1);
    }
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };



  return (
    <UserLayout>

      <Container>

        <div className="py-7">

          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">


            {/* =====================================================
                LEFT QUESTION PANEL
            ===================================================== */}

            <aside className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">


              {/* Interview Info */}

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                  <span className="text-lg">
                    🤖
                  </span>

                </div>


                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-900">
                    AI Interview
                  </p>

                  <p className="mt-0.5 text-xs capitalize text-slate-500">
                    {interview?.interview_type} Interview
                  </p>

                </div>

              </div>


              {/* Progress */}

              <div className="mt-6">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-medium text-slate-600">
                    Question {currentQuestion} of {totalQuestions}
                  </p>

                  <span className="text-xs font-semibold text-blue-600">
                    {Math.round(progress)}%
                  </span>

                </div>


                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>


              {/* Questions */}

              <div className="mt-6 space-y-1.5">

                {questions
                  .slice(0, totalQuestions)
                  .map((item, index) => {

                    const number = index + 1;

                    const active =
                      currentQuestion === number;

                    const answered =
                      Boolean(
                        typeof answers[number] === "string"
                          ? answers[number].trim()
                          : answers[number]?.answer?.trim()
                    );

                    return (
                      <button
                        key={number}
                        type="button"
                        disabled
                      aria-current={active ? "step" : undefined}
                        className={`
                        flex
                        w-full
                        cursor-default
                        items-start
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        transition
                        ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-500"
                        }

                        `}
                      >

                        <span
                          className={`
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-xs
                            font-semibold
                            ${
                              answered
                                ? "bg-emerald-100 text-emerald-600"
                                : active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >

                          {answered ? (
                            <Check size={14} />
                          ) : (
                            number
                          )}

                        </span>


                        <span className="line-clamp-2 pt-1 text-xs leading-4">
                          {item.question}
                        </span>

                      </button>
                    );

                  })}

              </div>

            </aside>



            {/* =====================================================
                MAIN INTERVIEW
            ===================================================== */}

            <main className="space-y-5">


              {/* =====================================================
                  AI INTERVIEWER
              ===================================================== */}


                <section className="relative h-[430px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-900 shadow-sm">

                {/* =====================================================
                    FULL BACKGROUND ROBOT IMAGE
                ===================================================== */}

                <img
                    src={robotImage}
                    alt="AI Interviewer"
                    className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    "
                />


                {/* Dark overlay for better visibility */}

                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/30" />


                {/* =====================================================
                    TOP BAR
                ===================================================== */}

                <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-5">

                    {/* AI Interviewer */}

                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/45 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md">

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

                    AI Interviewer

                    </div>


                    {/* Timer */}

                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-rose-500 shadow-lg">

                    <Clock3 size={16} />

                    {formatTime(timeLeft)}

                    </div>

                </div>


                {/* =====================================================
                    QUESTION CARD
                ===================================================== */}

                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-[18px] bg-white/95 p-4 shadow-xl backdrop-blur-md">


                    {/* Question Header */}

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-600">

                        {interviewerResponse
                          ? "AI Interviewer"
                          : isFollowUp
                            ? "Follow-up Question"
                            : `Question ${currentQuestion}`}

                      </span>

                      <button
                        type="button"
                        onClick={handleMuteToggle}
                        title={isMuted ? "Unmute interviewer" : "Mute interviewer"}
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-50
                          text-blue-600
                          transition
                          hover:bg-blue-100
                        "
                      >
                        {isMuted ? (
                          <VolumeX size={15} />
                        ) : (
                          <Volume2 size={15} />
                        )}
                      </button>

                    </div>
                    
                    



                    {conversationStage === "response" ? (
                      <div className="mt-2.5 max-w-4xl">
                        <p className="text-[15px] font-medium leading-6 text-slate-700">
                          {interviewerResponse}
                        </p>
                      </div>
                    ) : conversationStage === "followup" ? (
                      <div className="mt-2.5 max-w-4xl">

                        <p className="...">
                          {conversationStage === "ready"
                            ? "Before we begin, are you ready to start the interview? Please click the I'm Ready button below to begin."
                            : question}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2.5 max-w-4xl text-[15px] font-semibold leading-6 text-slate-900">
                        {question}
                      </p>
                    )}

                </div>

                </section>



              {/* =====================================================
                  ANSWER + TIPS
              ===================================================== */}

              <div className="grid gap-5 xl:grid-cols-[1fr_260px]">


                {/* Answer */}

                <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex items-center justify-between">

                    <h2 className="text-sm font-semibold text-slate-900">
                      Your Answer
                    </h2>


                    <span className="text-xs text-slate-400">
                      {answer.length}/2000
                    </span>

                  </div>


                  <div className="relative mt-3">

                    <textarea
                      value={answer}
                      onChange={(e) =>{
                        setAnswer(e.target.value.slice(0, 2000));
                        if (e.target.value.trim()) {
                          setWarning("");
                        }
                      }}
                      disabled={
                        conversationStage === "response" ||
                        isEvaluating
                      }
                      placeholder={
                        conversationStage === "response"
                          ? "Please wait for the interviewer..."
                          : "Type your answer here..."
                      }
                      rows={7}
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50/50
                        p-4
                        pr-16
                        text-sm
                        leading-6
                        text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />

                    {warning && (
                      <p className="mt-2 text-sm font-medium text-rose-600">
                        {warning}
                      </p>
                    )}


                    {/* Microphone */}

                    <button
                      type="button"
                      onClick={handleVoiceRecording}
                      className={`
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        text-white
                        shadow-md
                        transition
                        ${
                          isRecording
                            ? "bg-rose-500 shadow-rose-200"
                            : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"
                        }
                      `}
                    >

                      {isRecording ? (
                        <Square
                          size={16}
                          fill="currentColor"
                        />
                      ) : (
                        <Mic size={19} />
                      )}

                    </button>

                  </div>


                  {isRecording && (

                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-500">

                      <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />

                      Listening...

                    </div>

                  )}

                </section>



                {/* Tips */}

                <aside className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">

                      <Lightbulb
                        size={17}
                        className="text-amber-500"
                      />

                    </div>

                    <h2 className="text-sm font-semibold text-slate-900">
                      Tips
                    </h2>

                  </div>


                  <div className="mt-5 space-y-4">

                    <Tip>
                      Be clear and structured.
                    </Tip>

                    <Tip>
                      Use real examples where possible.
                    </Tip>

                    <Tip>
                      Take your time to explain.
                    </Tip>

                    <Tip>
                      Show your practical knowledge.
                    </Tip>

                  </div>

                </aside>

              </div>



              {/* =====================================================
                  CONTROLS
              ===================================================== */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 1}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-slate-600
                    shadow-sm
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  <ArrowLeft size={17} />

                  Previous

                </button>


                <button
                  type="button"
                  onClick={handleStopInterview}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-rose-50
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-rose-600
                    transition
                    hover:bg-rose-100
                  "
                >

                  <Square
                    size={14}
                    fill="currentColor"
                  />

                  Stop Interview

                </button>

                
                {(conversationStage !== "completed" || closingSpeechFinished) && (
                  <button
                    onClick={
                      conversationStage === "completed"
                        ? () =>
                            navigate("/ai-interview/complete", {
                              state: { config: interview, answers, interviewId },
                            })
                        : handleNext
                    }
                    disabled={isEvaluating || isRecording}
                    className="inline-flex items-center justify-center gap-2 rounded-xl
                     bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition
                     hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {conversationStage === "completed"
                      ? "Finish Interview"
                      : conversationStage === "ready"
                        ? "I'm Ready"
                        : isEvaluating
                          ? "Evaluating..."
                          : conversationStage === "response"
                            ? "Continue"
                            : "Next Question"}

                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}


              </div>

            </main>

          </div>

        </div>

      </Container>

    </UserLayout>
  );
};



const Tip = ({ children }) => {

  return (
    <div className="flex items-start gap-2.5">

      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

      <p className="text-xs leading-5 text-slate-500">
        {children}
      </p>

    </div>
  );

};


export default InterviewSession;