import { google } from "googleapis";
import type { SheetsRow } from "@/types/post";

function getAuth() {
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || "";
  // Handle both escaped \\n and literal newlines
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

export async function readPendingRows(): Promise<SheetsRow[]> {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_TAB_NAME || "";

  // Build range with optional sheet name prefix
  const range = sheetName ? `'${sheetName}'!A:M` : "A:M";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length <= 1) return [];

  return rows.slice(1).map((row, index) => ({
    rowIndex: index + 2,
    dia: row[0] || "",
    categoria: row[1] || "",
    titulo: row[2] || "",
    subtitulo: row[3] || "",
    hook: row[4] || "",
    descricao: row[5] || "",
    cta: row[6] || "",
    urlImg: row[7] || "",
    urlBg: row[8] || "",
    status: row[9] || "",
    postSaida: row[10] || "",
    modo: row[11] || "",
  }));
}

export async function updateRowStatus(
  rowIndex: number,
  status: string,
  outputUrl?: string
) {
  const sheets = getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  const values: string[][] = [[status]];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `J${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: { values },
  });

  if (outputUrl) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `K${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: { values: [[outputUrl]] },
    });
  }
}
