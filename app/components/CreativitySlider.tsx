interface CreativitySliderProps {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CreativitySlider({ value, onChange }: CreativitySliderProps) {
  // Ensure value is a number
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Generate label and color gradient based on value
  const getCreativityLabel = () => {
    if (numericValue < 0.3) return { label: "Conservative", color: "blue" };
    if (numericValue < 0.5) return { label: "Balanced", color: "teal" };
    if (numericValue < 0.8) return { label: "Creative", color: "purple" };
    return { label: "Wild", color: "pink" };
  };

  const { label, color } = getCreativityLabel();

  // Get appropriate tailwind classes based on color
  const getBadgeClasses = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-500/40 bg-blue-500/20 text-blue-300';
      case 'teal':
        return 'border-teal-500/40 bg-teal-500/20 text-teal-300';
      case 'purple':
        return 'border-purple-500/40 bg-purple-500/20 text-purple-300';
      case 'pink':
        return 'border-pink-500/40 bg-pink-500/20 text-pink-300';
      default:
        return 'border-blue-500/40 bg-blue-500/20 text-blue-300';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">Creativity Level</h3>
      <div className="space-y-6">
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-blue-400 font-semibold">Conservative</div>
            <div className="text-xs text-purple-400 font-semibold">Wild</div>
          </div>

          {/* Custom slider with visible styling */}
          <div className="relative h-8 flex items-center">
            {/* Background track */}
            <div className="absolute w-full h-2 bg-gray-700 rounded-full"></div>

            {/* Colored progress bar */}
            <div
              className="absolute h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              style={{ width: `${numericValue * 100}%` }}
            ></div>

            {/* Visible thumb */}
            <div
              className="absolute w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-150 transform hover:scale-110 border-2 border-purple-500"
              style={{
                left: `calc(${numericValue * 100}% - 12px)`,
                boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)'
              }}
            ></div>

            {/* Actual input control (invisible but functional) */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              name="temperature"
              value={value}
              onChange={onChange}
              className="absolute w-full h-8 opacity-0 cursor-pointer z-10"
              aria-label="Adjust creativity level"
            />
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ease-in-out ${getBadgeClasses()}`}
          >
            {label}
          </div>
          <span className="text-gray-400 text-sm font-mono">{numericValue.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
} 