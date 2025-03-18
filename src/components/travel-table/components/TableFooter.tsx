
import React from "react";

export const TableFooter = () => {
  return (
    <footer className="text-center text-sm text-muted-foreground py-2">
      <span className="inline-flex items-center gap-1">
        <a 
          href="https://sende.co/share-app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Feel free to use this app at your space.
        </a>
      </span>
      <div className="flex justify-center items-center mt-1">
        <span className="mr-1">Built by</span>
        <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
          <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-6" />
        </a>
      </div>
    </footer>
  );
};
