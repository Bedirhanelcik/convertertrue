import { createFileRoute } from "@tanstack/react-router";
import { ConverterPage } from "@/components/converter/ConverterPage";

export const Route = createFileRoute("/audio-converter")({
  component: AudioConverter,
});

function AudioConverter() {
  return (
    <ConverterPage
      title="Audio Converter"
      description="Convert your audio files quickly and securely between popular audio formats."
      acceptedType=".mp3,.wav,.flac,.ogg,.aac,.m4a,.mp4"
    />
  );
}