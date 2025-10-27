import { Button } from "@/components/ui/button";

type Props = {
  onClick?: () => void | Promise<void>;
};

export function ButtonInit({ onClick }: Props) {
  return (
    <div className="flex justify-end mt-4 p-4">
      <Button
        variant="secondary"
        className="bg-[#187E9B] text-white hover:bg-[#1f697e] min-w-[12rem]"
        onClick={onClick}
      >
        Iniciar
      </Button>
    </div>
  );
}
