import { createFileRoute } from "@tanstack/react-router";
import { ConverterPage } from "@/components/converter/ConverterPage";

export const Route = createFileRoute("/video-converter")({
  component: VideoConverter,
});

function VideoConverter() {
  return (
    <ConverterPage
      title="Video Converter"
      description="Convert your videos quickly and securely between popular video formats."
      acceptedType=".mp4,.mov,.avi,.webm,.mkv"
    />
  );
}