import { motion } from "motion/react";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

interface UploadCardProps {
  acceptedType: string;
  onFilesSelected: (files: File[]) => void;
}

export function UploadCard({
  acceptedType,
  onFilesSelected,
}: UploadCardProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
     onDrop={(e) => {
  e.preventDefault();
  setDrag(false);

  const files = Array.from(e.dataTransfer.files);

  if (!files.length) return;

const validFiles =
  acceptedType === "*"
    ? files
    : files.filter((file) => {
        // MIME türü: image/*, video/*, audio/*
        if (acceptedType.endsWith("/*")) {
          const category = acceptedType.split("/")[0];
          return file.type.startsWith(`${category}/`);
        }

        // Uzantı listesi: .png,.jpg,.jpeg...
        const allowedExtensions = acceptedType
          .split(",")
          .map((type) => type.trim().toLowerCase());

        const extension =
          "." + file.name.split(".").pop()?.toLowerCase();

        return allowedExtensions.includes(extension);
      });

  if (validFiles.length !== files.length) {
    alert("Some files are not supported by this converter.");
  }

  if (validFiles.length) {
    onFilesSelected(validFiles);
  }
}}
      className={
        "relative rounded-3xl border bg-surface/70 backdrop-blur-sm p-8 md:p-10 transition-all " +
        (drag
          ? "border-primary/60 shadow-[var(--shadow-glow)]"
          : "border-border/70 shadow-[var(--shadow-soft)]")
      }
    >
      <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_center,var(--primary-glow),transparent_70%)] opacity-60" />

      <div className="flex flex-col items-center text-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />

          <div className="relative w-16 h-16 rounded-2xl bg-primary/10 ring-1 ring-primary/30 grid place-items-center text-primary">
            <UploadCloud className="w-7 h-7" strokeWidth={2} />
          </div>
        </div>

        {acceptedType !== "*" && (
          <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Selected converter: {acceptedType.replace(".", "").toUpperCase()}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-lg font-medium tracking-tight">
            Drag & drop your file here
          </p>

          <p className="text-sm text-muted-foreground">
            or choose a file to get started
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedType}
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;

            if (!files) return;

            onFilesSelected(Array.from(files));
          }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-[var(--primary-hover)] shadow-[0_8px_24px_-8px_var(--primary-glow)] hover:shadow-[0_12px_32px_-8px_var(--primary-glow)]"
        >
          Select File

          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>

      <p className="text-xs text-muted-foreground/80">
  Supports popular image, video, audio and document formats
</p>
      </div>
    </motion.div>
  );
}