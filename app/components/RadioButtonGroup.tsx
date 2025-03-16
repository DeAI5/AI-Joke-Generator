interface Option {
  readonly emoji: string;
  readonly value: string;
  readonly label?: string;
  readonly color: string;
}

interface RadioButtonGroupProps {
  title: string;
  options: readonly Option[];
  name: string;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RadioButtonGroup({ title, options, name, selectedValue, onChange }: RadioButtonGroupProps) {
  const getColorClasses = (color: string, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-gray-700/30 hover:bg-gray-700/50 hover:scale-[1.02] border border-transparent hover:border-gray-600/30';
    }

    switch (color) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/20 scale-105';
      case 'green':
        return 'bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/50 shadow-lg shadow-green-500/20 scale-105';
      case 'yellow':
        return 'bg-gradient-to-br from-yellow-500/30 to-yellow-600/20 border border-yellow-500/50 shadow-lg shadow-yellow-500/20 scale-105';
      case 'red':
        return 'bg-gradient-to-br from-red-500/30 to-red-600/20 border border-red-500/50 shadow-lg shadow-red-500/20 scale-105';
      case 'purple':
        return 'bg-gradient-to-br from-purple-500/30 to-purple-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/20 scale-105';
      case 'pink':
        return 'bg-gradient-to-br from-pink-500/30 to-pink-600/20 border border-pink-500/50 shadow-lg shadow-pink-500/20 scale-105';
      case 'indigo':
        return 'bg-gradient-to-br from-indigo-500/30 to-indigo-600/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/20 scale-105';
      case 'orange':
        return 'bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/50 shadow-lg shadow-orange-500/20 scale-105';
      default:
        return 'bg-gradient-to-br from-gray-500/30 to-gray-600/20 border border-gray-500/50 shadow-lg shadow-gray-500/20 scale-105';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-700/50">
      <h3 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-2 lg:mb-0">{title}</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map(({ value, emoji, label, color }) => {
          const isSelected = selectedValue === value;
          return (
            <label
              key={value}
              className={`relative flex items-center p-4 rounded-lg cursor-pointer select-none transition-all duration-300 ease-in-out transform ${getColorClasses(color, isSelected)}`}
            >
              <input
                type="radio"
                name={name}
                value={value}
                onChange={onChange}
                className="hidden"
                checked={isSelected}
              />
              {isSelected && (
                <span className="absolute inset-0 rounded-lg overflow-hidden">
                  <span className="absolute -inset-[100%] animate-pulse opacity-20 bg-gradient-to-r from-transparent via-white to-transparent"></span>
                </span>
              )}
              <span className="text-xl mr-3">{emoji}</span>
              <span className={`text-gray-200 ${isSelected ? 'text-white font-medium' : ''}`}>
                {label || value}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
} 