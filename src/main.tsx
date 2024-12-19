import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import Home from "./routes/home";
import Layout from "./routes/layout";
import Category from "./routes/category";
import { ThemeProvider } from "./providers/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="fullstock-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:category" element={<Category />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
