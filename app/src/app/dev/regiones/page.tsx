/**
 * Responsabilidad: página de calibración del mapa de regiones.
 * Permite seleccionar un reporte de la bandeja si aún no se indicó ninguno,
 * o calibrar el mapa sobre el escaneo real del reporte seleccionado (?reporte=...).
 */

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";

import { MAPA_POR_DEFECTO, obtenerMapa } from "@/config/regiones";
import { MOSTRAR_CALIBRACION } from "@/config/entorno";
import { CalibracionConReporte } from "@/features/revision/components/calibracion/calibracion-con-reporte";
import { BarraHerramientas } from "@/features/revision/components/bandeja/barra-herramientas";
import { EstadosBandeja } from "@/features/revision/components/bandeja/estados-bandeja";
import { ListaTarjetas } from "@/features/revision/components/bandeja/lista-tarjetas";
import { ResumenBandeja } from "@/features/revision/components/bandeja/resumen-bandeja";
import { useBandeja } from "@/features/revision/hooks/use-bandeja";
import { TablaReportes } from "@/features/revision/components/bandeja/tabla-reportes";

function SelectorReporte() {
  const bandeja = useBandeja();

  const conArchivo =
    bandeja.estadoCarga === "listo" && bandeja.totalArchivo > 0;
  const conResultados = conArchivo && bandeja.reportes.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-raised p-4">
        <h2 className="text-base font-medium text-ink">
          Selecciona un reporte para calibrar
        </h2>
        <p className="mt-1 text-meta text-muted">
          Haz clic en un reporte de la tabla para abrir su escaneo y calibrar el mapa de regiones.
        </p>
      </div>

      {conArchivo ? (
        <>
          <ResumenBandeja resumen={bandeja.resumen} />
          <BarraHerramientas
            filtros={bandeja.filtros}
            orden={bandeja.orden}
            filtrosActivos={bandeja.filtrosActivos}
            resultados={bandeja.reportes.length}
            totalArchivo={bandeja.totalArchivo}
            onCambioBusqueda={bandeja.establecerBusqueda}
            onCambioEstado={bandeja.establecerEstado}
            onCambioOrigen={bandeja.establecerOrigen}
            onCambioOrden={bandeja.establecerOrden}
            onLimpiar={bandeja.limpiarFiltros}
          />
        </>
      ) : null}

      {bandeja.estadoCarga === "cargando" ? (
        <EstadosBandeja estado="cargando" />
      ) : null}

      {bandeja.estadoCarga === "error" ? (
        <EstadosBandeja estado="error" onReintentar={bandeja.reintentar} />
      ) : null}

      {bandeja.estadoCarga === "listo" && bandeja.totalArchivo === 0 ? (
        <EstadosBandeja estado="vacio" />
      ) : null}

      {conArchivo && bandeja.reportes.length === 0 ? (
        <EstadosBandeja
          estado="sin_resultados"
          onLimpiar={bandeja.limpiarFiltros}
        />
      ) : null}

      {conResultados ? (
        <>
          <TablaReportes reportes={bandeja.reportes} ruta="/dev/regiones?reporte=" />
          <ListaTarjetas reportes={bandeja.reportes} />
        </>
      ) : null}
    </div>
  );
}

function ContenidoCalibracion() {
  const searchParams = useSearchParams();
  const reporte = searchParams.get("reporte");
  const hayReporte = Boolean(reporte && reporte.trim().length > 0);
  const mapa = obtenerMapa(MAPA_POR_DEFECTO);

  return (
    <div className="mx-auto w-full max-w-(--layout-max) px-(--space-gutter) py-8">
      <header className="mb-6 max-w-3xl">
        <p className="text-micro uppercase tracking-label text-faint">
          Solo desarrollo
        </p>
        <h1 className="text-display font-semibold tracking-tight">
          Calibración del talonario
        </h1>
        <p className="mt-2 text-base text-muted">
          {mapa.nombre} · {mapa.paginas} páginas ·{" "}
          {Object.keys(mapa.regiones).length} regiones.{" "}
          {mapa.descripcion}
        </p>
        <p className="mt-1 text-meta text-faint">
          Si una región no coincide con la hoja, el recorte del campo va a
          mostrar otra cosa: ajusta el mapa en `config/regiones` antes de confiar en la vista de
          corrección.
        </p>
      </header>

      {hayReporte ? (
        <div>
          <div className="mb-4">
            <Link
              href="/dev/regiones"
              className="inline-flex items-center gap-1.5 text-meta font-medium text-petrol-700 transition-colors hover:text-petrol-800"
            >
              <span aria-hidden="true">&larr;</span> Cambiar reporte
            </Link>
          </div>

          <Suspense fallback={<p className="text-body text-muted">Cargando…</p>}>
            <CalibracionConReporte />
          </Suspense>
        </div>
      ) : (
        <SelectorReporte />
      )}
    </div>
  );
}

export default function PaginaCalibracion() {
  if (!MOSTRAR_CALIBRACION) notFound();

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-(--layout-max) px-(--space-gutter) py-8">
          <p className="text-body text-muted">Cargando…</p>
        </div>
      }
    >
      <ContenidoCalibracion />
    </Suspense>
  );
}
