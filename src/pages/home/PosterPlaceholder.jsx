import React from "react";

const PosterPlaceholder = ({ titulo }) => (
  <div className="w-full h-full bg-gradient-to-b from-[#1A1719] to-black flex items-center justify-center">
    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center px-2">
      {titulo}
    </span>
  </div>
);

export default PosterPlaceholder;