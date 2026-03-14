import { PDFParse } from "pdf-parse";

export const parsePDF = async (buffer: Buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error("PDF parsing failed: empty file buffer");
  }

  const parser = new PDFParse({ data: buffer });

  try {
    const textResult = await parser.getText();

    let info: unknown = null;
    try {
      const infoResult = await parser.getInfo();
      info = infoResult.info ?? null;
    } catch {
      // Metadata extraction is optional; keep text parsing as the success path.
    }

    return {
      text: textResult.text,
      pages: textResult.total,
      info
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown parser error";
    throw new Error(`PDF parsing failed: ${errorMessage}`);
  } finally {
    await parser.destroy();
  }
};