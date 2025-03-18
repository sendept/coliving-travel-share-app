
import { ReactNode } from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TravelFormValues } from "../types";
import { Button } from "@/components/ui/button";

interface FormLayoutProps {
  form: UseFormReturn<TravelFormValues>;
  onSubmit: (data: TravelFormValues) => void;
  children: ReactNode;
  submitLabel: string;
}

export const FormLayout = ({ form, onSubmit, children, submitLabel }: FormLayoutProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5 md:p-10 bg-[#FFFFFF] rounded-xl">
        {children}
        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white border-none">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
