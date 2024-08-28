import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../../Shared/ui/Layout";
import { Home } from "../Pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
