"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { claseTitulo } from "./nice";
import type { CasoRow } from "./models";

async function logoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/versus-blanco.png");
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generarPDF(c: CasoRow): Promise<void> {
  const a = c.analisis;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 42;
  let y = 0;

  const rojo: [number, number, number] = [249, 0, 0];
  const oscuro: [number, number, number] = [29, 29, 29];
  const celeste: [number, number, number] = [232, 247, 255];
  const gris: [number, number, number] = [110, 116, 128];

  doc.setFillColor(...oscuro); doc.rect(0, 0, W, 80, "F");
  doc.setFillColor(...rojo); doc.rect(0, 80, W, 4, "F");
  let tx = M;
  const logo = await logoDataUrl();
  if (logo) { try { doc.addImage(logo, "PNG", M, 20, 40, 40); tx = M + 52; } catch {} }
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(22);
  doc.text("VERSUS LEGAL", tx, 40);
  doc.setFontSize(10); doc.setTextColor(255, 190, 190);
  doc.text("Propiedad Industrial · Estudio de viabilidad marcaria", tx, 58);
  doc.setTextColor(255, 255, 255); doc.setFontSize(9);
  doc.text("Autoridad: SIC", W - M, 40, { align: "right" });
  doc.text("Colombia", W - M, 54, { align: "right" });
  y = 110;

  doc.setTextColor(...oscuro); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text("Informe de viabilidad de marca", M, y); y += 8;
  doc.setDrawColor(...celeste); doc.setLineWidth(2); doc.line(M, y, W - M, y); y += 22;

  const datos: [string, string][] = [
    ["Marca / signo:", c.nombre],
    ["Tipo de signo:", c.tipo],
    ["Titular / solicitante:", c.titular],
    ["Clase(s) de Niza:", c.clases.map((cl) => `${cl} — ${claseTitulo(cl)}`).join("  |  ")],
    ["Descripción:", c.descripcion || "—"],
    ["Fecha del estudio:", new Date(c.fecha).toLocaleDateString("es-CO")],
    ["Elaborado por:", c.autor || "—"],
  ];
  doc.setFontSize(10);
  datos.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold"); doc.setTextColor(...oscuro); doc.text(k, M, y);
    doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(String(v), W - M - 160);
    doc.text(lines, M + 150, y); y += lines.length * 13 + 4;
  });
  y += 8;

  doc.setFillColor(...celeste); doc.roundedRect(M, y, W - 2 * M, 70, 8, 8, "F");
  const col: [number, number, number] = a.score >= 70 ? [18, 146, 75] : a.score >= 45 ? [217, 130, 0] : [249, 0, 0];
  doc.setFont("helvetica", "bold"); doc.setFontSize(30); doc.setTextColor(...col);
  doc.text(`${a.score}%`, M + 22, y + 46);
  doc.setFontSize(12); doc.setTextColor(...oscuro);
  doc.text("VIABILIDAD ESTIMADA", M + 110, y + 28);
  doc.setFontSize(11); doc.setTextColor(...col);
  doc.text(a.nivel, M + 110, y + 46);
  y += 88;

  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...oscuro);
  doc.text("Factores evaluados", M, y); y += 6;
  autoTable(doc, {
    startY: y, margin: { left: M, right: M },
    head: [["Factor", "Puntaje"]],
    body: a.factores.map((f) => [f.n, `${f.v}%`]),
    styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: oscuro, textColor: 255 },
    alternateRowStyles: { fillColor: [248, 251, 255] },
  });
  // @ts-expect-error lastAutoTable inyectado por el plugin
  y = doc.lastAutoTable.finalY + 18;

  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Concepto y recomendación", M, y); y += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(50, 50, 50);
  const rec = doc.splitTextToSize(a.recomendacion, W - 2 * M);
  doc.text(rec, M, y); y += rec.length * 13 + 16;

  if (y > 640) { doc.addPage(); y = 60; }
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...oscuro);
  doc.text("Antecedentes / coincidencias", M, y); y += 6;
  if (a.coincidencias.length) {
    autoTable(doc, {
      startY: y, margin: { left: M, right: M },
      head: [["Marca", "Clase", "Similitud", "Estado", "Titular", "Expediente"]],
      body: a.coincidencias.map((m) => [m.marca, String(m.clase), `${m.sim}%`, m.estado, m.titular, m.expediente]),
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 4 },
      headStyles: { fillColor: rojo, textColor: 255 },
      alternateRowStyles: { fillColor: [255, 245, 245] },
    });
  } else {
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...gris);
    doc.text("No se hallaron coincidencias relevantes en la base de referencia.", M, y + 14);
  }

  const H = doc.internal.pageSize.getHeight();
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...celeste); doc.setLineWidth(1); doc.line(M, H - 52, W - M, H - 52);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...gris);
    const disc =
      "Documento de orientación elaborado por Versus Legal. El porcentaje de viabilidad se basa en los datos ingresados y una base de referencia; no constituye concepto jurídico definitivo ni garantía de registro. La verificación con validez legal se realiza en SIPI (sipi.sic.gov.co) y la decisión de registrabilidad corresponde a la SIC (Decisión 486 CAN).";
    doc.text(doc.splitTextToSize(disc, W - 2 * M), M, H - 42);
    doc.setTextColor(...rojo); doc.setFont("helvetica", "bold"); doc.text("VERSUS LEGAL", M, H - 14);
    doc.setTextColor(...gris); doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleString("es-CO"), W - M, H - 14, { align: "right" });
  }

  doc.save(`Informe_Viabilidad_${c.nombre.replace(/\s+/g, "_")}.pdf`);
}
