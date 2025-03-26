
import React from "react";
export const TableFooter = () => {
  return <footer className="text-center text-sm text-muted-foreground py-4 mt-16" style={{
    marginTop: '60px'
  }}>
      <span className="inline-flex items-center gap-1">
        <a href="https://sende.co/share-app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
          You may copy and use this app at your space
        </a>
      </span>
      <div className="text-[9px] mt-1 text-gray-500">
        Built for internal use of Sende, and for <a href="https://www.sende.co/start-a-coliving-space" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">Coliving training</a> users. Open for all creative spaces
      </div>
      <div className="flex justify-center items-center mt-1">
        <span className="mr-1">Built by</span>
        <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mx-0 px-0">
          <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-8" />
        </a>
      </div>
    </footer>;
};
