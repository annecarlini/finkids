/* rfce cria o componete react funcional ---- ES7 */
import AvatarFrontpage from '../../assets/Avatar-frontpage.png';
import './Homepage.css' /* Importando CSS */
import BtnInit from '@/components/ui/btn1';
import Navbar from '@/components/custom/Navbar/Navbar';



function Homepage() {
  return (
    <div className="home">
      <Navbar />
      <div className="home_description">
        <h1>
          A <strong>finkids</strong> é uma plataforma web gamificada criada para ensinar educação financeira de forma simples, interativa e divertida para crianças.
        </h1>
      </div>

      {/* Novo container para alinhar texto e imagem lado a lado */}
      <div className="home_content">
        <div className="home_subtitle">
          <h2>
            Nosso propósito é mostrar, desde cedo, como pode ser fascinante
            assumir o controle da vida financeira e crescer com essa habilidade.
          </h2>
          
        </div>

        <div className="img_frontpage">
          <img src={AvatarFrontpage} alt="Avatar Frontpage" />
        </div>
      </div>

      <div className="card-tittle">
          <h2>Como funciona a plataforma?</h2>
      </div>
      <div className="instruction">
        <div className="card1">
          <h3>1</h3>
          <p>Antes de sair gastando por aí, você vai entender como o dinheiro funciona. O que é mesada? Como fazer um orçamento? O que significa economizar? Tudo explicado com exemplos do seu dia a dia.</p>
        </div>
        <div className="card2">
          <h3>2</h3>
          <p>Depois de aprender, é hora de mostrar que entendeu! Você vai responder quizzes rápidos e divertidos que ajudam a fixar o conteúdo. Acerte as perguntas e desbloqueie conquistas!</p> 
        </div>
        <div className="card3">
          <h3>3</h3>
          <p>Agora é hora do jogo! Você vai ganhar mesada, decidir o que comprar, economizar ou investir. Cada escolha tem consequência, e você vai ver como pensar antes de gastar pode fazer toda a diferença. </p>
        </div>
        <div className="card4">
          <h3>4</h3>
          <p>Qual o desafio?
            Mostrar que sabe cuidar do seu dinheiro com inteligência, muita responsabilidade e muita diversão.
          </p>
          <BtnInit />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
