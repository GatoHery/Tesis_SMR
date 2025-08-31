import { Route, Routes } from "react-router";
import { RouterType } from "@/types/router.types";
import pagesData from "./pagesData";
import Main from "@/layout/Main";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";

const Router = () => {
  const protectedRoutes = pagesData
    .filter((page) => page.path !== "/login")
    .map((page: RouterType) => (
      <Route
        key={page.title}
        path={page.path}
        element={
          <ProtectedRoute allowedRoles={page.roles}>
            {page.element}
          </ProtectedRoute>
        }
      />
    ));

  const publicRoutes = pagesData
    .filter((page) => page.path === "/login")
    .map((page: RouterType) => (
      <Route
        key={page.title}
        path={page.path}
        element={page.element}
      />
    ));

  return (
    <Routes>
      {publicRoutes}
      <Route element={<Main />}>
        {protectedRoutes}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
