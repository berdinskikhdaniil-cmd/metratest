import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex justify-center items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="text-2xl font-bold text-[#8D5FFF] tracking-tighter">
        metra<span className="text-[#111010]">.media</span>
      </div>
    </header>
  );
};