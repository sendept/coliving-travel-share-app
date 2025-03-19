
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <ShadcnTableHeader>
      <TableRow className="border-b-0 bg-white hover:bg-white">
        {/* Row number header */}
        <TableHead className="w-12 text-center">#</TableHead>
        <TableHead className="text-left text-base font-medium text-[#333333]">
          Route
        </TableHead>
        <TableHead className="text-center text-base font-medium text-[#333333]">
          Travel together
        </TableHead>
        <TableHead className="text-center text-base font-medium text-[#333333]">
          Date & Time
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};
