import { RouterType } from "@/types/router.types"
import Monitor from "@/pages/Monitor";
import Overview from "@/pages/Overview";
import Reservations from "@/pages/Reservations";
import Users from "@/pages/Users";
import Login from "@/pages/Login";

const pagesData: RouterType[] = [
  {
    path: "/login",
    title: "Login",
    element: <Login />,
  },
  {
    path: "/",
    title: "Overview",
    element: <Overview />,
    roles: ["ADMIN", "SUPER_ADMIN"]
  },
  {
    path: "/monitor",
    title: "Monitor",
    element: <Monitor />,
    roles: ["ADMIN", "SUPER_ADMIN"]
  },
  {
    path: "/reservations",
    title: "Reservations",
    element: <Reservations />,
    roles: ["ADMIN", "SUPER_ADMIN"]
  },
  {
    path: "/users",
    title: "Users",
    element: <Users />,
    roles: ["SUPER_ADMIN"]
  }
];

export default pagesData