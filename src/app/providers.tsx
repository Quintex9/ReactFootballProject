"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  // centralizovaný wrapper na kontexte obľúbených
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

