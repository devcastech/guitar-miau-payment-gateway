import { BrowserRouter, Route, Routes } from "react-router";
import { MainLayout } from "./layout/MainLayout";
import { Home } from "./pages/home/Home";
import { Product } from "./pages/product/Product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="*" element={<h1>404</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;
