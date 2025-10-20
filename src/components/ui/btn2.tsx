import { Button } from "@/components/ui/button"

export default function BtnAcess() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Button size="lg"className="bg-[#E97E34]
      text-white
      px-6
      py-3
      rounded-2xl
      hover:bg-[#cf6b2a]
      hover:outline
      transition-all
      duration-300
      shadow-md">ACESSAR CONTA</Button>
    </div>
  )
}