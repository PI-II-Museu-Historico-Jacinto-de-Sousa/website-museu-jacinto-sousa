import { HTTPError } from "../errors/HTTPError";
import { defer, redirect, type Params } from "react-router-dom";
import { ClientExposicaoFirebase } from "../Utils/exposicaoFirebase";
import { auth } from "../../firebase/firebase";

const currentUserPromise = async () => {
  await auth.authStateReady();
  if (!auth.currentUser) {
    throw new Response("Unauthorized", {
      status: 403,
      statusText: "Você não tem permissão para acessar essa página",
    });
  }
  return auth.currentUser;
};

export const privateLoader = async () => {
  return defer({
    currentUser: currentUserPromise(),
  });
};

export const homeRedirectLoader = () => {
  return redirect("/home");
};

export const loginRedirectLoader = async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    window.alert(
      "Você já está autenticado, redirecionando para a página inicial"
    );
    return redirect("/home");
  } else {
    return new Response("OK");
  }
};

export const exposicaoLoader = async ({
  params,
}: {
  params: Params<"privacidade" | "idExposicao">;
}) => {
  const idSegments = [
    "exposicoes",
    params.privacidade,
    "lista",
    params.idExposicao,
  ];
  const id = idSegments.join("/");
  const client = new ClientExposicaoFirebase();
  try {
    return await client.getExposicao(id);
  } catch (e: unknown) {
    if (e instanceof HTTPError) {
      throw new Response(e.message, { status: e.status });
    }
    throw new Response("Erro desconhecido ao carregar exposição", {
      status: 500,
    });
  }
};
