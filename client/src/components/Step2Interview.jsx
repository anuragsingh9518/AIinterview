import React, { useEffect, useRef, useState } from 'react'
import female from "../assets/female-ai.mp4"
import male from "../assets/male-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from 'axios'
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const hasSpokenIntroRef = useRef(false);
  const currentSpokenQuestionIndexRef = useRef(-1);
  // Ref to always hold the latest answer (avoids stale closure in auto-submit)
  const answerRef = useRef("");
  // Prevents double-submit race between manual submit and auto-submit
  const isQuestionSubmittedRef = useRef(false);

  const [isAiPlaying, setIsAiPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const currentQuestion = questions[currentIndex];

  const [timeLeft, setTimeLeft] = useState(
    currentQuestion?.timeLimit || questions[0]?.timeLimit || 60
  );

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      // try known female voices first
      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }
      // try known male voices 
      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );
      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }
      // fallback: first voice
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [])

  const videoSource = voiceGender === "male" ? male : female;

  // --------speak function with robust promise resolution-------------//
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        setSubtitle(text);
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, Math.max(2000, text.length * 80));
        return;
      }

      try {
        window.speechSynthesis.cancel();
      } catch (e) { }

      // add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", .... ")
        .replace(/\./g, ",. .... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utteranceRef.current = utterance;

      let isResolved = false;
      const safetyTimeoutDuration = Math.max(4000, text.length * 150);

      const finishSpeech = () => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(safetyTimer);

        if (videoRef.current) {
          try {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          } catch (e) { }
        }
        setIsAiPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      const safetyTimer = setTimeout(() => {
        console.warn("Speech synthesis fallback timeout triggered");
        finishSpeech();
      }, safetyTimeoutDuration);

      utterance.onstart = () => {
        setIsAiPlaying(true);
        stopMic();
        if (videoRef.current) {
          videoRef.current.play().catch(() => { });
        }
      };

      utterance.onend = () => {
        finishSpeech();
      };

      utterance.onerror = (err) => {
        console.warn("Speech synthesis error:", err);
        finishSpeech();
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  // Main flow controller effect
  useEffect(() => {
    if (!selectedVoice) return;

    const runFlow = async () => {
      if (isIntroPhase && !hasSpokenIntroRef.current) {
        hasSpokenIntroRef.current = true;
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling good and confident and ready.`
        );
        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.`
        );
        setIsIntroPhase(false);
      } else if (!isIntroPhase && currentQuestion && currentSpokenQuestionIndexRef.current !== currentIndex) {
        currentSpokenQuestionIndexRef.current = currentIndex;
        await new Promise(r => setTimeout(r, 500));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
      }
    }
    runFlow();
  }, [selectedVoice, isIntroPhase, currentIndex])

  // Timer countdown effect
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      })
    }, 1000);
    return () => clearInterval(timer)
  }, [isIntroPhase, currentIndex])

  // Reset timer on new question
  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || currentQuestion.timeLeft || 60);
    }
  }, [currentIndex, isIntroPhase])

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => {
        const next = prev ? prev + " " + transcript : transcript;
        answerRef.current = next; // keep ref in sync
        return next;
      });
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, [])

  const startMic = () => {
    if (recognitionRef.current && !isAiPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // already started or stopped
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // already stopped
      }
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn)
  };

  const submitAnswer = async () => {
    // Guard: state-based check + ref-based check to catch race conditions
    if (isSubmitting || isQuestionSubmittedRef.current) return;
    isQuestionSubmittedRef.current = true;
    stopMic();
    setIsSubmitting(true)
    try {
      const timeLimit = currentQuestion?.timeLimit || 60;
      const currentAnswer = answerRef.current; // use ref — never stale
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer: currentAnswer,
        timeTaken: timeLimit - timeLeft,
      }, { withCredentials: true })
      setFeedback(result.data.feedback)
      await speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
      console.log("Submit answer error:", error);
      isQuestionSubmittedRef.current = false; // allow retry on network error
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    // Reset the submitted flag for the next question FIRST
    isQuestionSubmittedRef.current = false;
    answerRef.current = "";

    if (currentIndex + 1 >= questions.length) {
      setAnswer("");
      setFeedback("");
      finishInterview();
      return;
    }
    await speakText("All right, let's move to the next question.");
    // Move to next question first — this triggers timeLeft reset via useEffect
    setCurrentIndex(currentIndex + 1);
    // Clear answer/feedback AFTER index change so auto-submit can't fire
    // with timeLeft=0 + feedback="" on the new question
    setAnswer("");
    setFeedback("");
  }

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true })
      console.log(result.data);
      onFinish(result.data)
    } catch (error) {
      console.log("Finish interview error:", error)
    }
  }

  // Auto-submit when time reaches 0
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft, isIntroPhase, currentQuestion, isSubmitting, feedback]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (e) { }
      }
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) { }
      }
    };
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 h-[88vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload='auto'
              className='w-full h-auto object-cover'
            />
          </div>

          {/* subtitle area — always rendered to prevent layout shift */}
          <div className='w-full max-w-md min-h-[56px] bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm transition-opacity duration-300' style={{opacity: subtitle ? 1 : 0, pointerEvents: subtitle ? 'auto' : 'none'}}>
            <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle || '\u00A0'}</p>
          </div>

          {/* timer area */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>
                Interview status
              </span>
              {isAiPlaying && (
                <span className='text-sm font-semibold text-emerald-600'>
                  AI Speaking
                </span>
              )}
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || currentQuestion?.timeLeft || 60} />
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-xs text-gray-400 block'>Current Question</span>
              </div>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-xs text-gray-400 block'>Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text section */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative overflow-y-auto'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
            AI Smart Interview
          </h2>

          {!isIntroPhase && (
            <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
              <p className='text-xs sm:text-sm text-gray-400 mb-2'>
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
                {currentQuestion?.question}
              </div>
            </div>
          )}

          <textarea
            placeholder="Type or speak your answer here..."
            onChange={(e) => {
              setAnswer(e.target.value);
              answerRef.current = e.target.value; // keep ref in sync
            }}
            value={answer}
            className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl outline-none resize-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 min-h-[160px]'
          />

          {/* Bottom action area — fixed min-height to prevent layout resize */}
          <div className='mt-6 min-h-[88px]'>
            {/* Submit buttons — hidden when feedback is shown */}
            <div className={`flex items-center gap-4 transition-all duration-200 ${feedback ? 'hidden' : 'flex'}`}>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                type="button"
                className='w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-black text-white shadow-lg cursor-pointer'
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>
              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                type="button"
                className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500 cursor-pointer'
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>

            {/* Feedback area — hidden when no feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className='bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'
              >
                <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
                <button
                  onClick={handleNext}
                  type="button"
                  className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold cursor-pointer'
                >
                  Next question <BsArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Interview