import CircularProgress from "@mui/material/CircularProgress";
import React, { Suspense } from "react";
import { Await, Outlet, createBrowserRouter, defer, redirect, useLoaderData } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import Root from "../Root";
import Erro from "../pages/Erro";

const Home = React.lazy(() => import("../pages/Home"));
const CriarItemAcervo = React.lazy(() => import("../pages/CriarItemAcervo"));
const Login = React.lazy(() => import("../pages/Login"));

const centeredLoading = (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </div>)


const currentUserPromise = async () => {
  await auth.authStateReady()
  if (!auth.currentUser) {
    throw new Response("Unauthorized", { status: 403, statusText: "Você não tem permissão para acessar essa página" })
  }
  return auth.currentUser
}

const privateLoader = async () => {
  return defer({
    currentUser: currentUserPromise(),
  })
}
const homeRedirectLoader = () => {
  return redirect("/home")
}
const loginRedirectLoader = async () => {
  await auth.authStateReady()
  if (auth.currentUser) {
    window.alert("Você já está autenticado, redirecionando para a página inicial")
    return redirect("/home")
  }
  else {
    return new Response("OK")
  }
}
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
        ]
      },
    ]
  }]);

export default router;
