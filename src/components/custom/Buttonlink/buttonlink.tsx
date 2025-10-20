import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function ButtonLink() {
  return (
  <Button asChild variant="link">
    <Link to="/">Voltar</Link>
  </Button>
  );
}


