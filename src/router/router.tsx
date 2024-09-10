import CircularProgress from "@mui/material/CircularProgress";
import React, { Suspense } from "react";
import { Await, Outlet, createBrowserRouter, useLoaderData } from "react-router-dom";
import Root from "../Root";
import Erro from "../pages/Erro";
import { exposicaoLoader, homeRedirectLoader, loginRedirectLoader, privateLoader } from "./loaders";

const Home = React.lazy(() => import("../pages/Home"));
const CriarItemAcervo = React.lazy(() => import("../pages/CriarItemAcervo"));
const ItemAcervo = React.lazy(() => import("../pages/ItemAcervo"));
const PageExposicao = React.lazy(() => import("../pages/exposicoes/VisualizarExposicao"));
const Login = React.lazy(() => import("../pages/Login"));
const CriarExposicao = React.lazy(() => import("../pages/CriarExposicao"));

const centeredLoading = (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </div>)


/**
*  Componente wrapper para todas as rotas que precisam de autenticação
*/
const ProtectedRoutes = () => {
  const { currentUser } = useLoaderData() as { currentUser: Promise<void> }
  return (
    <Suspense fallback={centeredLoading}>
      <Await resolve={currentUser}>
        <Outlet />
      </Await>
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement:
      <Root>
        <Erro />
      </Root>,
    children: [
      {
        index: true,
        loader: homeRedirectLoader,
      },
      {
        path: "/home",
        element:
          <Suspense fallback={centeredLoading}>
            <Home />
          </Suspense>,
      },
      {
        path: "/login",
        loader: loginRedirectLoader,
        element:
          <Suspense fallback={centeredLoading}>
            <Login />
          </Suspense>,
      },
      {
        element: <ProtectedRoutes />,
        loader: privateLoader,
        children: [
          {
            path: "/acervo/criar-item",

            element:
              <CriarItemAcervo />
          },
          {
            path: "/exposicoes/criar-exposicao",
            element:
              <CriarExposicao />
          },
        ]
      },
      {
        path: "/colecoes/privado/lista/:idColecao/itens/:id",
        element:
          <Suspense fallback={centeredLoading}>
            <ItemAcervo />
          </Suspense>,
      },
      {
        path: "/colecoes/publico/lista/:idColecao/publico/:id",
        element:
          <Suspense fallback={centeredLoading}>
            <ItemAcervo />
          </Suspense>,
      },
      {
        path: "/colecoes/publico/lista/:idColecao/privado/:id",
        element:
          <Suspense fallback={centeredLoading}>
            <ItemAcervo />
          </Suspense>,
      },
      {
        path: "exposicoes/:privacidade/lista/:idExposicao", // apenas exposicoes/:privacidade/:idExposicao?
        loader: exposicaoLoader,
        element:
          <Suspense fallback={centeredLoading}>
            <PageExposicao />
          </Suspense>,
      },

      },
    ]
  }]);

export default router;
