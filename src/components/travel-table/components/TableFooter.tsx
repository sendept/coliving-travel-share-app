
import React from "react";

export const TableFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-2 mt-[40px] bg-white">
      <span className="inline-flex items-center">
        <a href="https://sende.co/share-app" target="_blank" rel="noopener noreferrer" className="mr-1">
          Feel free to use this app at your space
        </a>
        Built by
        <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1">
          <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-6" />
        </a>
      </span>
    </footer>
  );
};
