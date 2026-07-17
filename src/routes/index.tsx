import { createFileRoute } from "@tanstack/react-router";
import { ConverterPage } from "@/components/converter/ConverterPage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <ConverterPage
      title="Convert Any File"
      description="Fast, secure and free file conversions supporting hundreds of formats — right in your browser."
    />
  );
}