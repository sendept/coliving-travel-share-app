
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <ShadcnTableHeader>
      <TableRow className="border-t-0 bg-[#F5F5F5]">
        <TableHead className="w-[80px] text-center align-middle border-r">
          <div className="text-sm text-black font-medium">Edit</div>
          <div className="text-[10px] text-gray-500">Editar</div>
        </TableHead>
        <TableHead className="lg:w-[400px] min-w-[300px] text-center align-middle border-r">
          <div className="text-sm text-black font-medium">Route</div>
          <div className="text-[10px] text-gray-500">Ruta</div>
        </TableHead>
        <TableHead className="lg:w-[240px] w-[160px] text-center align-middle border-r">
          <div className="text-sm text-black font-medium">Travel together</div>
          <div className="text-[10px] text-gray-500">Viajar juntos</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
          <div className="text-sm text-black font-medium whitespace-nowrap">Date/Hour</div>
          <div className="text-[10px] text-gray-500 whitespace-nowrap">Fecha/Hora</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
          <div className="text-sm text-black font-medium">Contact</div>
          <div className="text-[10px] text-gray-500">Contacto</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle">
          <div className="text-sm text-black font-medium">Diet</div>
          <div className="text-[10px] text-gray-500">Dieta</div>
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};
