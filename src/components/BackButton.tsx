"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  label = "Späť",
}: {
  label?: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-200 transition-colors"
    >
      <span>←</span> {label}
    </button>
  );
}

