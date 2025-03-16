"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { JokeEvaluationDisplay } from "./components/JokeEvaluationDisplay";
import { RadioButtonGroup } from "./components/RadioButtonGroup";
import { CreativitySlider } from "./components/CreativitySlider";
import { topics, tones, jokeTypes } from "./constants/jokeOptions";
import dynamic from "next/dynamic";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

interface JokeState {
  topic: string;
  tone: string;
  type: string;
  temperature: number;
}

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const [state, setState] = useState<JokeState>({
    topic: "",
    tone: "",
    type: "",
    temperature: 0.7
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate")) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: name === 'temperature' ? parseFloat(value) : value,
    });
  };

  const generateJoke = () => {
    append({
      role: "user",
      content: `Generate a ${state.topic} joke in a ${state.tone} tone, make it a ${state.type} type of joke`,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black py-6 px-4 overflow-hidden relative">
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50
        }}>
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.1}
            initialVelocityY={10}
            confettiSource={{
              x: windowSize.width / 2,
              y: windowSize.height - 20,
              w: windowSize.width * 2,
              h: 0
            }}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-12 -left-16 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-16 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-full md:max-w-[75%] mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient">
              AI Joke Generator
            </h2>
            <p className="text-gray-300 text-sm max-w-full mx-auto">
              Create your unique joke by selecting the options below
              and let AI craft some humor just for you!
            </p>
          </div>

          <div className="w-full space-y-8 backdrop-blur-sm bg-gray-900/50 p-8 rounded-2xl shadow-xl border border-gray-800/50 hover:border-purple-900/50 transition-all duration-300">
            <RadioButtonGroup
              title="TOPIC"
              options={topics}
              name="topic"
              selectedValue={state.topic}
              onChange={handleChange}
            />

            <RadioButtonGroup
              title="TONE"
              options={tones}
              name="tone"
              selectedValue={state.tone}
              onChange={handleChange}
            />

            <RadioButtonGroup
              title="TYPE"
              options={jokeTypes}
              name="type"
              selectedValue={state.type}
              onChange={handleChange}
            />

            <CreativitySlider
              value={state.temperature}
              onChange={handleChange}
            />

            <button
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300
                ${isLoading || !state.topic || !state.tone || !state.type
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg cursor-pointer hover:shadow-purple-500/30 hover:scale-[1.01] relative overflow-hidden group'
                }
              `}
              disabled={isLoading || !state.topic || !state.tone || !state.type}
              onClick={generateJoke}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>

              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : 'Generate Joke'}
            </button>

            {messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate") && (
              <div className="mt-8 animate-fadeIn">
                <JokeEvaluationDisplay content={messages[messages.length - 1]?.content || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}