"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

