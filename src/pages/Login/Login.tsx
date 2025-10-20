import "./Login.css"
import { Logincard } from "@/components/custom/Login/Logincard";
import  AvatarN  from "../../assets/AvatarN.png"
import { ButtonLink } from "@/components/custom/Buttonlink/buttonlink";

function Login() {
  return (
    <div className="login-page">

        <div className="back-card">
            <h1>Bem vindo(a)!</h1>
            <p>Acesse o seu perfil</p>
            <div className="card-container flex flex-col items-start gap-4">
              <Logincard />
            </div>
            <div className="text-left ml-32 p-4">
              <ButtonLink />
            </div>
           
        </div>    

        <div className="second-text">
          <h2>O futuro começa hoje!</h2>
          <p>Vamos rumo a uma vida financeira mais saudável?</p>
        </div>

        <div className="img_loginpage">
          <img src={AvatarN} alt="Avatar Frontpage" />
        </div>
        
    </div>
  )
}

export default Login