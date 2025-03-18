
import React from "react";

export const TableFooter = () => {
  return (
    <footer className="text-center text-sm text-muted-foreground py-2 mt-[90px]">
      <span className="inline-flex items-center gap-1">
        <a 
          href="https://sende.co/share-app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-blue-500 transition-colors duration-200"
        >
          Feel free to use this app at your space.
        </a>
      </span>
      <div className="flex justify-center items-center mt-2">
        <span>Built by</span>
        <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-2">
          <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-6" />
        </a>
      </div>
    </footer>
  );
};
