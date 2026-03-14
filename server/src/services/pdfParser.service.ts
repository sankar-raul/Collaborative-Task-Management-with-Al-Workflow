import { PDFParse } from "pdf-parse";

class PdfParserService {
  private static getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Unknown parser error";
  }

  private static validateBuffer(buffer: Buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error("invalid file buffer");
    }

    if (buffer.length === 0) {
      throw new Error("empty file buffer");
    }

    const header = buffer.subarray(0, 5).toString("utf-8");
    if (header !== "%PDF-") {
      throw new Error("uploaded file is not a valid PDF");
    }
  }

  static async parsePDF(buffer: Buffer) {
    this.validateBuffer(buffer);

    let parser: PDFParse | null = null;

    try {
      parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();

      if (!textResult?.text?.trim()) {
        throw new Error("no extractable text found in PDF");
      }

      let info: unknown = null;
      try {
        const infoResult = await parser.getInfo();
        info = infoResult?.info ?? null;
      } catch {
        // Metadata extraction is optional; text extraction is the primary flow.
      }

      return {
        text: textResult.text,
        pages: textResult.total ?? 0,
        info,
      };
    } catch (error) {
      throw new Error(`PDF parsing failed: ${this.getErrorMessage(error)}`);
    } finally {
      if (parser) {
        try {
          await parser.destroy();
        } catch {
          // Ignore parser cleanup errors to preserve the original error path.
        }
      }
    }
  }
}

export default PdfParserService;
export const parsePDF = PdfParserService.parsePDF.bind(PdfParserService);