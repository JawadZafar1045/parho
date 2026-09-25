import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
function createPdf(title: string) {
  const safeTitle = title.replace(/[()\\]/g, "\\$&");
  const stream = `BT\n/F1 22 Tf\n72 700 Td\n(${safeTitle}) Tj\n/F1 12 Tf\n0 -32 Td\n(Parho study material) Tj\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export async function GET(_request: Request, { params }: { params: Promise<{ pdfId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!getSessionUser(token)) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }

  const { pdfId } = await params;
  const title = pdfId.replace(/-\d+$/, "").replace(/-/g, " ");
  return new Response(createPdf(title), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${pdfId}.pdf"` } });
}
