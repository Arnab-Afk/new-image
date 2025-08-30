"use client";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`flex items-center justify-between p-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">AI</span>
        </div>
        <span className="text-white font-semibold text-lg">AI Playground</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          Play
        </button>
        <button className="bg-cyan-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
}
