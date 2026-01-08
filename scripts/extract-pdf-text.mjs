import fs from "fs";
import { PDFParse, VerbosityLevel } from "pdf-parse";

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("Usage: node scripts/extract-pdf-text.mjs /path/to/file.pdf");
  process.exit(1);
}

const outputPath = process.argv[3] ?? pdfPath.replace(/\.pdf$/i, ".txt");

const data = fs.readFileSync(pdfPath);
const parser = new PDFParse({ verbosity: VerbosityLevel.ERRORS });
const result = await parser.getText(data, {});

fs.writeFileSync(outputPath, result.text);
console.log(`Wrote ${outputPath}`);
