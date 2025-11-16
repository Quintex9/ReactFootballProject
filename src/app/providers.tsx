"use client";

import { FavoritesProvider } from "@/context/FavoritesContext";

// Globálny wrapper ktorý sprístupní FavoritesContext celej appke
export default function Providers({ children }: { children: React.ReactNode }) {
  // centralizovaný wrapper na kontexte obľúbených
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

