import {
  FileText,
  ArrowRight,
  X,
  Image,
  Music,
  Video,
  FileArchive,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { FORMAT_MAP } from "@/lib/formats";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { QueueFile } from "@/types/queue";
import {
  Button,
} from "@/components/ui/button";
import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileQueueProps {
  files: QueueFile[];
  acceptedType: string;
  inputFormat: string | null;

  setFileOutputFormat: (
    id: string,
    value: string
  ) => void;

  applyOutputFormatToAll: (
    value: string
  ) => void;

  removeFile: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  startConversion: () => void;
  onConvertMore: () => void;
  isConverting: boolean;
  converterTitle: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function getFileIcon(type: string | null) {
  switch (type) {
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "gif":
    case "svg":
      return <Image className="w-6 h-6 text-primary" />;

    case "mp3":
    case "wav":
    case "aac":
    case "ogg":
    case "flac":
      return <Music className="w-6 h-6 text-primary" />;

    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "webm":
      return <Video className="w-6 h-6 text-primary" />;

    case "zip":
    case "rar":
    case "7z":
    case "tar":
      return <FileArchive className="w-6 h-6 text-primary" />;

    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="w-6 h-6 text-primary" />;

    default:
      return <FileText className="w-6 h-6 text-primary" />;
  }
}

export function FileQueue({
  files,
  inputFormat,
  acceptedType,
  setFileOutputFormat,
  applyOutputFormatToAll,
  removeFile,
  onAddFiles,
  startConversion,
  onConvertMore,
  isConverting,
  converterTitle,
}: FileQueueProps) {

  const availableFormats =
    FORMAT_MAP[inputFormat ?? ""] ?? [];
const inputRef = useRef<HTMLInputElement>(null);
const downloadFile = (file: QueueFile) => {
  if (!file.convertedFile) return;

  const bytes = Uint8Array.from(
    atob(file.convertedFile.data),
    (c) => c.charCodeAt(0)
  );

  const blob = new Blob([bytes], {
    type: file.convertedFile.mimeType,
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.convertedFile.name;
  a.click();

  URL.revokeObjectURL(url);
};
  return (
  <div className="mx-auto max-w-7xl px-6 py-14">

    <div className="mb-10">

      <h1 className="text-5xl font-bold tracking-tight">
        {converterTitle}
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Convert your{" "}
        <span className="font-medium uppercase">
          {inputFormat}
        </span>{" "}
        files into another format quickly, securely and directly in your browser.
      </p>

    </div>

    {files.map((item) => {

  const availableFormats =
    FORMAT_MAP[item.inputFormat] ?? [];

  return (
<motion.div
  key={item.id}
  initial={{
    opacity: 0,
    y: 20,
    scale: 0.98,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
    boxShadow:
      item.status === "completed"
        ? [
            "0 0 0px rgba(34, 197, 94, 0)",
            "0 0 28px rgba(34, 197, 94, 0.25)",
            "0 0 0px rgba(34, 197, 94, 0)",
          ]
        : "0 0 0px rgba(34, 197, 94, 0)",
  }}
  transition={{
    opacity: { duration: 0.35 },
    y: { duration: 0.35 },
    scale: { duration: 0.35 },
    boxShadow: { duration: 1.5 },
  }}
>
  <Card className="mb-5 rounded-3xl border-border/70 bg-surface/70">
      <CardContent className="p-6">

        <div className="flex flex-wrap items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              {getFileIcon(item.inputFormat)}
            </div>

            <div>

              <h3 className="font-semibold text-lg">
                {item.file.name}
              </h3>

            <p
  className={`mt-1 text-xs font-medium ${
    item.status === "completed"
      ? "text-green-500"
      : item.status === "converting"
      ? "text-blue-500"
      : item.status === "uploading"
      ? "text-yellow-500"
      : item.status === "error"
      ? "text-red-500"
      : "text-primary"
  }`}
>
  {item.status === "completed"
  ? "Conversion completed"
  : item.status === "converting"
  ? "Converting..."
  : item.status === "waiting"
  ? "Waiting"
  : "Error"}
</p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <Button
              variant="outline"
              className="rounded-xl min-w-[90px]"
            >
              {item.inputFormat.toUpperCase()}
            </Button>

            <ArrowRight />

            <Select
  value={item.outputFormat ?? ""}
  onValueChange={(value) =>
    setFileOutputFormat(item.id, value)
  }
>
  <SelectTrigger className="w-[220px] rounded-xl">
    <SelectValue placeholder="Select Format" />
  </SelectTrigger>

  <SelectContent>
    {availableFormats.map((format) => (
      <SelectItem
        key={format}
        value={format}
      >
        {format.toUpperCase()}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{files.length > 1 &&
  files[0].id === item.id &&
  item.outputFormat && (
    <Button
      variant="outline"
      size="sm"
      className="rounded-xl whitespace-nowrap"
      onClick={() =>
        applyOutputFormatToAll(item.outputFormat!)
      }
      disabled={isConverting}
    >
      Apply to all
    </Button>
  )}

         <Button
  variant="ghost"
  size="icon"
 onClick={() => removeFile(item.id)}
>
  <X className="w-5 h-5" />
</Button>
          </div>

        </div>
{/* CONVERTING PROGRESS */}
{item.status === "converting" && (
  <div className="mt-5">
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
        style={{
          width: `${item.progress}%`,
        }}
      />
    </div>

    <div className="mt-2 flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        {item.progress}%
      </p>

      <Loader2 className="w-4 h-4 animate-spin text-primary" />
    </div>
  </div>
)}

{/* COMPLETED RESULT */}
{item.status === "completed" && item.convertedFile && (
  <motion.div
    initial={{
      opacity: 0,
      backgroundColor: "rgba(34, 197, 94, 0.18)",
    }}
    animate={{
      opacity: 1,
      backgroundColor: "rgba(34, 197, 94, 0)",
    }}
    transition={{
      opacity: { duration: 0.3 },
      backgroundColor: {
        duration: 1.8,
        ease: "easeOut",
      },
    }}
    className="mt-5 border-t border-border/60 pt-4"
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex min-w-0 items-center gap-3">

        <span className="shrink-0 rounded-md border border-green-500/40 bg-green-500/10 px-2 py-1 text-xs font-semibold tracking-wide text-green-500">
          FINISHED
        </span>

        <div className="min-w-0">
          <span className="font-medium">
            {item.convertedFile.name}
          </span>

          <span className="ml-2 text-sm text-muted-foreground">
            · {formatSize(item.convertedFile.size)}
          </span>
        </div>

      </div>

      <Button
        onClick={() => downloadFile(item)}
        className="shrink-0 bg-green-500 text-black hover:bg-green-400"
      >
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>

    </div>
  </motion.div>
)}
      </CardContent>

    </Card>
    </motion.div>
  );

})}
<div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

  {files.every((f) => f.status === "completed") ? (
    <>
      {/* CONVERT MORE FILES */}
      <Button
        variant="outline"
        className="rounded-xl h-11 px-6"
        onClick={onConvertMore}
      >
        Convert More Files
      </Button>

      {/* DOWNLOAD ALL */}
      <Button
        className="rounded-xl h-11 px-6"
        onClick={() => files.forEach(downloadFile)}
      >
        <Download className="mr-2 w-4 h-4" />
        Download All
      </Button>
    </>
  ) : (
    <>
      {/* ADD MORE FILES */}
      <div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedType}
          className="hidden"
          onChange={(e) => {
            if (!e.target.files) return;

            onAddFiles(Array.from(e.target.files));

            e.target.value = "";
          }}
        />

        <Button
          className="rounded-xl h-11 px-6 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => inputRef.current?.click()}
          disabled={isConverting || files.length >= 10}
        >
          + Add More Files
        </Button>
      </div>

      {/* CONVERT */}
      <Button
        className="rounded-xl h-11 px-8"
        onClick={startConversion}
        disabled={
          isConverting ||
          files.length === 0 ||
          files.some((f) => !f.outputFormat)
        }
      >
        {isConverting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {isConverting ? "Converting..." : "Convert"}
      </Button>
    </>
  )}

</div>
  </div>
);
}