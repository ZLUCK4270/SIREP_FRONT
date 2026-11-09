import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { MOSTRAR_CALIBRACION } from "@/config/entorno";

export const metadata: Metadata = {
  title: "Calibración de regiones",
  robots: { index: false, follow: false },
};

export default function LayoutCalibracion({
  children,
}: {
  children: ReactNode;
}) {
  if (!MOSTRAR_CALIBRACION) notFound();

  return children;
}

