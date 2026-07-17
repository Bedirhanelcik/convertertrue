import { createFileRoute } from "@tanstack/react-router";
import { ConverterPage } from "@/components/converter/ConverterPage";

export const Route = createFileRoute("/document-converter")({
  component: DocumentConverter,
});

function DocumentConverter() {
  return (
 <ConverterPage
  title="Document Converter"
  description="Convert Word, PowerPoint and Excel documents to PDF quickly and securely."
  acceptedType=".pdf,.docx,.pptx,.xlsx"
/>
  );
}