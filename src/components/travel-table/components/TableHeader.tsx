
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <ShadcnTableHeader>
      <TableRow className="bg-white">
        <TableHead className="lg:w-[400px] min-w-[300px] text-center align-middle">
          <div className="text-sm text-black font-medium uppercase">ROUTE</div>
          <div className="text-[10px] text-gray-500">Ruta</div>
        </TableHead>
        <TableHead className="lg:w-[240px] w-[160px] text-center align-middle">
          <div className="text-sm text-black font-medium uppercase">TRAVEL TOGETHER</div>
          <div className="text-[10px] text-gray-500">Viajar juntos</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle">
          <div className="text-sm text-black font-medium uppercase whitespace-nowrap">DATE/HOUR</div>
          <div className="text-[10px] text-gray-500 whitespace-nowrap">Fecha/Hora</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle">
          <div className="text-sm text-black font-medium uppercase">DIET</div>
          <div className="text-[10px] text-gray-500">Dieta</div>
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};
