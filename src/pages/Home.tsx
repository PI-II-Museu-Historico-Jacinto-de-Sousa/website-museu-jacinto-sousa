//import { methodsItemAcervo } from "../Utils/itemAcervoFirebase";
//import { Colecao } from "../interfaces/Colecao";
//import { ItemAcervo } from "../interfaces/ItemAcervo";
//import React, { useState } from "react";

const Home = () => {
  /*const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleButtonClick = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const newItem = {
      dataDoacao: new Date(),
      nome: "Item domestico",
      descricao: "Descrição",
      colecao: "Item domestico",
      curiosidades: "Curiosidades",
      privado: true,
      imagens: [{
        title: file.name,
        alt: "Imagem",
        src: file
      } as unknown as Imagem]
    } as unknown as ItemAcervo;

    await methodsItemAcervo.adicionarItemAcervo(
      newItem,
      {
        id: "colecoes/privado/lista/Fotografia",
        nome: "Fotografia",
        privado: false,
      } as Colecao
    );
  };

  const editarArquivo = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const newItem = {
      dataDoacao: new Date(),
      descricao: "Descrição",
      colecao: "Item doméstico",
      nome: "Nome",
      curiosidades: "Curiosidades",
      privado: false,
      imagens: [{
        title: file.name,
        alt: "Imagem",
        src: file
      }] as Array<Imagem>
    } as unknown as ItemAcervo;

    await methodsItemAcervo.updateItemAcervo(
      newItem,
      "colecoes/privado/lista/Fotografia/itens/DlzTWn5Q2pKuF5M4HO8q",
      {
        id: "colecoes/privado/lista/Fotografia",
        nome: "Fotografia",
        privado: false,
      } as Colecao
    );
    COLOCAR DENTRO DO RETURN
    <div style={{ padding: "20px" }}>
      <input type="file" id="file" onChange={handleFileChange} />
      <button onClick={handleButtonClick}>Adicionar</button>
      <button onClick={editarArquivo}>Editar</button>
    </div>
  }*/

  return (
    <div>

    </div>
  );
};

export default Home;
