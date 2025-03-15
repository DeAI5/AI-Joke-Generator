import { useState, useEffect, useRef } from 'react';

interface JokeEvaluation {
  shock_value: number;
  offensiveness: number;
  creativity: number;
  controversy: number;
  tags: string[];
}

interface JokeEvaluationDisplayProps {
  content: string;
}

// Create a default evaluation object for fallback
const defaultEvaluation: JokeEvaluation = {
  shock_value: 5,
  offensiveness: 3,
  creativity: 7,
  controversy: 4,
  tags: ["funny"]
};

export function JokeEvaluationDisplay({ content }: JokeEvaluationDisplayProps) {
  // Add a state to control bar animations
  const [animateMetrics, setAnimateMetrics] = useState(false);
  const [jokeText, setJokeText] = useState('');
  const [evaluation, setEvaluation] = useState(defaultEvaluation);
  const componentRef = useRef<HTMLDivElement>(null);
  const prevContentRef = useRef<string>('');
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll only while content is still streaming
  useEffect(() => {
    // If content is still changing, set up scroll
    if (content !== prevContentRef.current) {
      prevContentRef.current = content;

      // Scroll once immediately
      if (componentRef.current) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }

      // Clear any existing timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Set timeout to scroll one more time after a short delay
      // This gives time for the content to render
      scrollTimerRef.current = setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
        scrollTimerRef.current = null;
      }, 500);
    }

    // Cleanup
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [content]);

  // Process content when it changes
  useEffect(() => {
    const processContent = () => {
      // Check for code block format - ```json
      const markdownJsonIndex = content.indexOf('```json');
      if (markdownJsonIndex > 0) {
        // Extract joke text (everything before the ```json)
        const extractedJokeText = content.substring(0, markdownJsonIndex).trim();
        setJokeText(extractedJokeText);

        // Try to extract and parse JSON from the code block
        try {
          // Find end of code block
          const codeBlockEnd = content.indexOf('```', markdownJsonIndex + 6);
          if (codeBlockEnd > markdownJsonIndex) {
            // Extract just the JSON content between ```json and ```
            const jsonContent = content.substring(markdownJsonIndex + 6, codeBlockEnd).trim();
            const parsedData = JSON.parse(jsonContent);
            if (parsedData && typeof parsedData === 'object' && 'tags' in parsedData) {
              setEvaluation(parsedData);
            }
          }
        } catch {
          // Use default evaluation if parsing fails
        }
        return;
      }

      // If no markdown codeblock, look for raw JSON data in the content
      const jsonStartIndex = content.indexOf('{');
      if (jsonStartIndex > 0) {
        // Extract joke text (everything before the JSON)
        const extractedJokeText = content.substring(0, jsonStartIndex).trim();
        setJokeText(extractedJokeText);

        // Try to parse JSON
        try {
          const jsonString = content.substring(jsonStartIndex);
          const parsedData = JSON.parse(jsonString);
          if (parsedData && typeof parsedData === 'object' && 'tags' in parsedData) {
            setEvaluation(parsedData);
          }
        } catch {
          // Use default evaluation if parsing fails
        }
      } else {
        // No JSON found, show entire content as joke
        setJokeText(content);
      }
    };

    processContent();
  }, [content]);

  // Trigger the animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateMetrics(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to get color classes based on metric and value
  const getMetricColorClass = (key: string, val: number): string => {
    if (key === "offensiveness" || key === "shock_value" || key === "controversy") {
      if (val > 7) return "from-red-500 to-orange-500";
      else if (val > 4) return "from-yellow-500 to-orange-500";
    } else if (key === "creativity") {
      if (val > 7) return "from-green-500 to-teal-500";
    }
    return "from-blue-500 to-purple-500";
  };

  // If there's no content yet, return a more compact component
  if (!content) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-700/50 text-center text-gray-400 italic">
        Your joke will appear here
      </div>
    );
  }

  return (
    <div
      ref={componentRef}
      className="space-y-6 bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700/50 transition-all duration-300 hover:border-purple-500/30"
    >
      <div className={`text-2xl font-medium text-gray-100 leading-relaxed relative pl-6 border-l-4 border-purple-500 ${jokeText ? 'min-h-[3rem]' : 'min-h-0'}`}>
        <span className="absolute -left-5 top-0 text-4xl text-purple-400 opacity-40">&ldquo;</span>

        {/* Display joke text directly since content is already streaming */}
        <div className="inline-block whitespace-pre-wrap">{jokeText}</div>

        <span className="absolute -right-3 bottom-0 text-4xl text-purple-400 opacity-40">&rdquo;</span>
      </div>

      {/* Only show metrics if we have joke text */}
      {jokeText && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="col-span-full">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {evaluation.tags.map((tag: string, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105 transition-all cursor-default animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-full mt-2">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-semibold">Metrics</h3>
          </div>

          {Object.entries(evaluation)
            .filter(([key]) => key !== 'tags')
            .map(([key, value], index) => {
              const val = Number(value);
              const colorClass = getMetricColorClass(key, val);

              return (
                <div
                  key={key}
                  className="bg-gray-700/40 p-5 rounded-lg hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-[1.02] animate-fadeIn"
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-300 font-medium capitalize">{key.replace('_', ' ')}</div>
                    <span className="text-lg font-bold text-white">{value}<span className="text-xs text-gray-400">/10</span></span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-in-out origin-left`}
                      style={{
                        transform: animateMetrics ? 'scaleX(1)' : 'scaleX(0)',
                        width: `${(val / 10) * 100}%`,
                        transitionDelay: `${(index + 1) * 150}ms`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
} 