import { Button } from "@/components/ui/button";

export function ButtonResp() {
  return (
    <div className="flex justify-end mt-4 p-4">
        <Button
        variant="secondary"
        className="bg-[#e97e34] text-white hover:bg-[#1f697e] min-w-[5rem] ">
        Quizz!
        </Button>
    </div>
  );
}
