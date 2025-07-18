import { Outlet } from "react-router"
import { Header } from "../components/Header";

export const MainLayout = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <footer>footer</footer>
    </main>
  );
}
