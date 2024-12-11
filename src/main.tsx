import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import Home from "./routes/home";
import RootLayout from "./routes/root-layout";
import Category from "./routes/category";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/:category" element={<Category />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
