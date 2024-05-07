import { infoMuseuMethods } from '../Utils/infoMuseuFirebase';

const Home = () => {
  const funcao = () => {
    const aux = document.getElementById("arquivo") as HTMLInputElement;
    if (aux.files && aux.files[0]) {
      const file = aux.files[0];
      const imagem = {
        src: file,
        title: "teste2",
        alt: "teste"
      };
      infoMuseuMethods.adicionarInfoMuseu({ nome: "Nome", texto: "Alt", imagem });
    }
  };

  return (
    <div>
      <input type="file" placeholder="Digite o nome do item" id="arquivo" />
      <button onClick={funcao}>
        Adicionar
      </button>
    </div>
  );
};

export default Home;
