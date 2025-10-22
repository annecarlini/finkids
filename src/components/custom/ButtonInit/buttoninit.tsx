import { Button } from "@/components/ui/button";

export function ButtonInit() {
  return (
    <div className="flex justify-end mt-4 p-4">
        <Button
        variant="secondary"
        className="bg-[#187E9B] text-white hover:bg-[#1f697e] min-w-[12rem]">
        Iniciar
        </Button>
    </div>
  );
}
