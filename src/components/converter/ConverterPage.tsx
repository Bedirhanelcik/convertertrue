import { useRef, useState } from "react";
import type { QueueFile } from "@/types/queue";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { FileQueue } from "@/components/converter/FileQueue";

interface ConverterPageProps {
  title: string;
  description: string;
  acceptedType?: string;
}

export function ConverterPage({
  title,
  description,
  acceptedType: initialAcceptedType = "*",
}: ConverterPageProps) {
  const [queue, setQueue] = useState<QueueFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [inputFormat, setInputFormat] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string | null>(null);
  const [acceptedType, setAcceptedType] = useState(initialAcceptedType);
  const [converterTitle, setConverterTitle] = useState("Converter");
  const abortControllerRef = useRef<AbortController | null>(null);
  const startConversion = async () => {
  // Format seçilmemiş dosya varsa conversion başlatma
  const missingFormat = queue.find(
    (item) => !item.outputFormat
  );

  if (missingFormat) {
    alert(
      `Please select an output format for ${missingFormat.file.name}.`
    );
    return;
  }

  setIsConverting(true);

  const controller = new AbortController();
  abortControllerRef.current = controller;

  // Dosyaları converting durumuna getir
  setQueue((prev) =>
    prev.map((item) => ({
      ...item,
      status: "converting",
      progress: 0,
    }))
  );

  // Smooth progress
  // Backend cevap verene kadar maksimum %90
  const progressInterval = window.setInterval(() => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.status !== "converting") {
          return item;
        }

        if (item.progress >= 90) {
          return item;
        }

        const increase = Math.random() * 4 + 1;

        return {
          ...item,
          progress: Math.min(
            90,
            Math.round(item.progress + increase)
          ),
        };
      })
    );
  }, 120);

  const startTime = Date.now();

  try {
    const formData = new FormData();

    // Dosyaları ekle
    queue.forEach((item) => {
      formData.append("files", item.file);
    });

    // Formatları AYRI olarak aynı sırayla ekle
    queue.forEach((item) => {
      formData.append(
        "outputFormats",
        item.outputFormat!
      );
    });

    console.log(
      "Sending files:",
      queue.map((item) => ({
        name: item.file.name,
        inputFormat: item.inputFormat,
        outputFormat: item.outputFormat,
      }))
    );

    console.log("Sending request...");

const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/convert`,
  {
    method: "POST",
    body: formData,
    signal: controller.signal,
  }
);

    console.log(
      "Response received:",
      response.status
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Backend error:",
        errorText
      );

      throw new Error(
        `Conversion failed: ${response.status}`
      );
    }

    console.log(
      "Reading response JSON..."
    );

    const result = await response.json();

    console.log(
      "Backend result:",
      result
    );

    if (
      !result.files ||
      !Array.isArray(result.files)
    ) {
      throw new Error(
        "Invalid response from backend: files array is missing."
      );
    }

    if (
      result.files.length !== queue.length
    ) {
      throw new Error(
        `Expected ${queue.length} converted files, but received ${result.files.length}.`
      );
    }

    // Çok hızlı conversion olsa bile
    // progress animasyonu görünsün
    const minimumDuration = 1500;

    const elapsed =
      Date.now() - startTime;

    if (elapsed < minimumDuration) {
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          minimumDuration - elapsed
        )
      );
    }

    // Progress interval artık gerekli değil
    clearInterval(progressInterval);

    console.log(
      "Setting progress to 100..."
    );

    // Backend'den gelen dosyaları
    // queue sırasına göre eşleştir
    setQueue((prev) =>
      prev.map((item, index) => ({
        ...item,
        progress: 100,
        convertedFile:
          result.files[index],
      }))
    );

    // %100 animasyonu görünsün
    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    console.log(
      "Setting files to completed..."
    );

    // Completed durumuna geçir
    setQueue((prev) =>
      prev.map((item) => ({
        ...item,
        status: "completed",
      }))
    );

    console.log(
      "Conversion successfully completed."
    );
  } catch (error) {
    clearInterval(progressInterval);

    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      console.log(
        "Conversion aborted by user."
      );

      return;
    }

    console.error(
      "Conversion error:",
      error
    );

    setQueue((prev) =>
      prev.map((item) => ({
        ...item,
        status: "error",
      }))
    );
  } finally {
    clearInterval(progressInterval);

    abortControllerRef.current = null;

    setIsConverting(false);
  }
};

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/25">
      <Navbar />

      <main>
        {queue.length === 0 ? (
          <>
            <Hero
              acceptedType={acceptedType}
              title={title}
              description={description}
              onFilesSelected={(files) => {
  if (!files.length) return;

  const MAX_FILES = 10;
  const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1 GB

  if (files.length > MAX_FILES) {
    alert("You can upload a maximum of 10 files at once.");
    return;
  }

  const totalSize = files.reduce(
    (total, file) => total + file.size,
    0
  );

  if (totalSize > MAX_TOTAL_SIZE) {
    alert("The total size of all files cannot exceed 1 GB.");
    return;
  }

const newFiles: QueueFile[] = files.map((file) => ({
  id: crypto.randomUUID(),
  file,
  inputFormat:
    file.name.split(".").pop()?.toLowerCase() ?? "",
  outputFormat: null,
  status: "waiting",
  progress: 0,
}));

  setQueue(newFiles);

  const ext = newFiles[0].inputFormat;

  setInputFormat(ext);
  setConverterTitle(`${ext.toUpperCase()} Converter`);
}}
            />

           <Categories />
          </>
        ) : (
          <FileQueue
  files={queue}
  acceptedType={acceptedType}
  inputFormat={inputFormat}
  converterTitle={converterTitle}

  onConvertMore={() => {
    abortControllerRef.current = null;
    setQueue([]);
    setIsConverting(false);
    setInputFormat(null);
  }}

 setFileOutputFormat={(id, value) => {
  setQueue((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            outputFormat: value,
          }
        : item
    )
  );
}}

applyOutputFormatToAll={(value) => {
  setOutputFormat(value);

  setQueue((prev) =>
    prev.map((item) => ({
      ...item,
      outputFormat: value,
    }))
  );
}}

  removeFile={(id) => {
    if (isConverting) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setIsConverting(false);
    }

    setQueue((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }}

  onAddFiles={(files) => {
    if (!files.length) return;

    const MAX_FILES = 10;
    const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1 GB

    const currentTotalSize = queue.reduce(
      (total, item) => total + item.file.size,
      0
    );

    const newFilesTotalSize = files.reduce(
      (total, file) => total + file.size,
      0
    );

    if (queue.length + files.length > MAX_FILES) {
      const remaining = MAX_FILES - queue.length;

      alert(
        `You can upload a maximum of 10 files. You can add ${remaining} more file(s).`
      );

      return;
    }

    if (
      currentTotalSize + newFilesTotalSize >
      MAX_TOTAL_SIZE
    ) {
      alert(
        "The total size of all uploaded files cannot exceed 1 GB."
      );

      return;
    }

    const newFiles: QueueFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      inputFormat:
        file.name.split(".").pop()?.toLowerCase() ?? "",
      outputFormat,
      status: "waiting",
      progress: 0,
    }));

    setQueue((prev) => [...prev, ...newFiles]);
  }}

  isConverting={isConverting}
  startConversion={startConversion}
/>
        )}
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ConverterTrue. All rights reserved.
          </p>

          <p className="font-mono">
            All conversions run securely — files never leave your device.
          </p>
        </div>
      </footer>
    </div>
  );
}