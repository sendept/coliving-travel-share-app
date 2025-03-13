
import React from "react";

export const TableFooter = () => {
  return (
    <>
      <div className="absolute bottom-4 right-4 md:right-6 lg:right-8 origin-bottom-right rotate-90 transform z-10">
        <a 
          href="https://airtable.com/appSEq5rTb2wminZh/shrevCpLAyaJQJXS5" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[9px] text-[#F97316] hover:text-[#F97316]/80 underline whitespace-nowrap px-0 py-0 mx-[10px] my-0 block mt-4"
        >
          Report a bug or suggest changes
        </a>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 text-center text-sm text-muted-foreground py-4 mt-[90px] bg-white">
        <span className="inline-flex items-center">
          Feel free to use it. Built by
          <a href="https://sende.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1">
            <img src="/lovable-uploads/5939e496-5d0c-421e-9294-eb688e353313.png" alt="Sende" className="h-6" />
          </a>
        </span>
      </footer>
    </>
  );
};
