import { Outlet } from "react-router"
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const MainLayout = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};
