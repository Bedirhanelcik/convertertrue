import { createFileRoute } from "@tanstack/react-router";
import { ConverterPage } from "@/components/converter/ConverterPage";

export const Route = createFileRoute("/image-converter")({
  component: ImageConverter,
});

function ImageConverter() {
  return (
    <ConverterPage
      title="Image Converter"
      description="Convert your images quickly and securely between popular image formats."
      acceptedType=".png,.jpg,.jpeg,.webp,.avif,.gif,.tiff,.tif"
    />
  );
}