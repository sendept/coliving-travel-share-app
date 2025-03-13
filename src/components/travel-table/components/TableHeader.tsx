
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <ShadcnTableHeader>
      <TableRow className="border-none bg-[#F5F5F5]">
        <TableHead className="w-[80px] text-center align-middle border-r">
          <div className="text-sm">Edit</div>
          <div className="text-[10px]">Editar</div>
        </TableHead>
        <TableHead className="lg:w-[400px] min-w-[300px] text-center align-middle border-r">
          <div className="text-sm">Route</div>
          <div className="text-[10px]">Ruta</div>
        </TableHead>
        <TableHead className="lg:w-[240px] w-[160px] text-center align-middle border-r">
          <div className="text-sm">Travel together</div>
          <div className="text-[10px]">Viajar juntos</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
          <div className="text-sm whitespace-nowrap">Date/Hour</div>
          <div className="text-[10px] whitespace-nowrap">Fecha/Hora</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle border-r">
          <div className="text-sm">Contact</div>
          <div className="text-[10px]">Contacto</div>
        </TableHead>
        <TableHead className="lg:w-[150px] w-[120px] text-center align-middle">
          <div className="text-sm">Diet</div>
          <div className="text-[10px]">Dieta</div>
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};
