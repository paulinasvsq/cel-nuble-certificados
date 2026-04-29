import jsPDF from 'jspdf';

export interface DatosCertificado {
  nombre: string;
  apellido: string;
  rut: string;
  razon: string;
  fechaAtencion: string;
}

function formatFechaTexto(fecha: string): string {
  const d = new Date(fecha + 'T12:00:00');
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

async function cargarImagen(ruta: string): Promise<string> {
  const resp = await fetch(ruta);
  const blob = await resp.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export async function generarCertificadoPDF(
  datos: DatosCertificado
): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 25;
  const marginRight = 25;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let y = 20;

  // --- LOGO (izquierda) ---
  const logoBase64 = await cargarImagen('/logo-cel.jpg');
  const logoWidth = 45;
  const logoHeight = 25;
  doc.addImage(logoBase64, 'JPEG', marginLeft, y, logoWidth, logoHeight);
  y += logoHeight + 8;

  // --- Línea separadora (fina, negra) ---
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  y += 15;

  // --- Título del certificado ---
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('CERTIFICADO MÉDICO', pageWidth / 2, y, { align: 'center' });
  y += 20;

  // --- Cuerpo del certificado ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  const fechaTexto = formatFechaTexto(datos.fechaAtencion);
  const hoy = formatFechaTexto(new Date().toISOString().split('T')[0]);

  const cuerpo =
    `Mediante el presente certifico que la paciente ${datos.nombre} ${datos.apellido}, ` +
    `RUT ${datos.rut}, el día ${fechaTexto} ha sido evaluado en CEL ÑUBLE.` +
    `\n\n` +
    `${datos.razon}` +
    `\n\n` +
    `Se extiende el presente certificado a petición del/la interesado/a ` +
    `para los fines que estime convenientes.`;

  const lineas = doc.splitTextToSize(cuerpo, contentWidth);
  doc.text(lineas, marginLeft, y);
  y += lineas.length * 7 + 15;

  // --- Fecha de emisión ---
  doc.setFontSize(11);
  doc.text(`Chillán, ${hoy}.`, marginLeft, y);
  y += 25;

  // --- Firma escaneada ---
  const firmaX = pageWidth / 2;
  try {
    const firmaBase64 = await cargarImagen('/firma-dra-2.png');
    const firmaWidth = 50;
    const firmaHeight = 25;
    doc.addImage(firmaBase64, 'PNG', firmaX - firmaWidth / 2, y, firmaWidth, firmaHeight);
    y += firmaHeight + 2;
  } catch {
    // Si no hay firma escaneada, dejar espacio
    y += 20;
  }

  // --- Línea de firma ---
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.4);
  doc.line(firmaX - 35, y, firmaX + 35, y);
  y += 6;

  // --- Datos fijos de la Dra. ---
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text('Dra. Isidora Lobos Canahuate', firmaX, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('RUT: 19.416.800-4', firmaX, y, { align: 'center' });
  y += 5;
  doc.text('N° Registro SIS: 910210', firmaX, y, { align: 'center' });
  y += 5;
  doc.text('CEL Ñuble', firmaX, y, { align: 'center' });

  // --- Pie de página ---
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Centro de Evaluación Laboral - CEL Ñuble', pageWidth / 2, footerY, { align: 'center' });

  // --- Descargar ---
  const nombreArchivo = `certificado_${datos.apellido}_${datos.nombre}_${datos.fechaAtencion}.pdf`;
  doc.save(nombreArchivo.replace(/\s+/g, '_'));
}
