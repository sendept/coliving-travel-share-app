
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { TableHeader } from "./TableHeader";

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableContainer = ({ children }: TableContainerProps) => {
  return (
    <div className="hidden md:block bg-white p-4 mt-12">
      <div 
        className="lg:overflow-visible overflow-x-auto overflow-y-auto scrollbar-visible" 
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #F5F5F5',
          transform: 'rotateX(180deg)'
        }}
      >
        <div style={{ transform: 'rotateX(180deg)' }}>
          <Table className="w-full bg-white">
            <TableHeader />
            <TableBody>
              {children}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
