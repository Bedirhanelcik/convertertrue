import { Injectable } from "@nestjs/common";
import sharp from "sharp";
import * as libre from "libreoffice-convert";
import { promisify } from "util";
import { execFile } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { promises as fs } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

const libreConvert = promisify(libre.convert);
const execFileAsync = promisify(execFile);

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

@Injectable()
export class ConverterService {
  async convert(
    files: Express.Multer.File[],
    outputFormats: string[],
  ) {
    console.log("========== CONVERSION STARTED ==========");
    console.log("Files:", files.length);
    console.log("Output formats:", outputFormats);

    if (files.length !== outputFormats.length) {
      throw new Error(
        `File count (${files.length}) and output format count (${outputFormats.length}) do not match.`,
      );
    }

    const convertedFiles = await Promise.all(
      files.map(async (file, index) => {
        const format = outputFormats[index]
          ?.trim()
          .toLowerCase();

        if (!format) {
          throw new Error(
            `Output format is missing for file: ${file.originalname}`,
          );
        }

        const inputFormat =
          file.originalname
            .split(".")
            .pop()
            ?.toLowerCase() ?? "";

        console.log(
          `[CONVERT ${index + 1}/${files.length}] ${file.originalname}: ${inputFormat} -> ${format}`,
        );

        let result;

        // IMAGE
        const imageFormats = [
          "png",
          "jpg",
          "jpeg",
          "webp",
          "avif",
          "gif",
          "tiff",
          "tif",
        ];

        if (imageFormats.includes(inputFormat)) {
          result = await this.convertImage(
            file,
            format,
          );

          console.log(
            `[COMPLETED] ${file.originalname} -> ${format}`,
          );

          return result;
        }

        // DOCUMENT -> PDF
        const documentFormats = [
          "docx",
          "pptx",
          "xlsx",
        ];

        if (
          documentFormats.includes(inputFormat) &&
          format === "pdf"
        ) {
          result =
            await this.convertDocumentToPdf(file);

          console.log(
            `[COMPLETED] ${file.originalname} -> PDF`,
          );

          return result;
        }

        // PDF -> DOCX
        if (
          inputFormat === "pdf" &&
          format === "docx"
        ) {
          result =
            await this.convertPdfToDocx(file);

          console.log(
            `[COMPLETED] ${file.originalname} -> DOCX`,
          );

          return result;
        }

        // AUDIO
        const audioFormats = [
          "mp3",
          "wav",
          "flac",
          "ogg",
          "aac",
          "m4a",
        ];

        if (audioFormats.includes(inputFormat)) {
          result = await this.convertMedia(
            file,
            inputFormat,
            format,
            "audio",
          );

          console.log(
            `[COMPLETED] ${file.originalname} -> ${format}`,
          );

          return result;
        }

        // VIDEO
        const videoFormats = [
          "mp4",
          "mov",
          "avi",
          "webm",
          "mkv",
        ];

        if (videoFormats.includes(inputFormat)) {
          result = await this.convertMedia(
            file,
            inputFormat,
            format,
            "video",
          );

          console.log(
            `[COMPLETED] ${file.originalname} -> ${format}`,
          );

          return result;
        }

        throw new Error(
          `Unsupported conversion: ${inputFormat} -> ${format}`,
        );
      }),
    );

    console.log(
      "========== ALL CONVERSIONS COMPLETED ==========",
    );

    return {
      success: true,
      files: convertedFiles,
    };
  }

  // =========================================================
  // IMAGE
  // =========================================================

  private async convertImage(
    file: Express.Multer.File,
    outputFormat: string,
  ) {
    console.log(
      `[IMAGE] Converting ${file.originalname} -> ${outputFormat}`,
    );

    let image = sharp(file.buffer);

    switch (outputFormat) {
      case "jpg":
      case "jpeg":
        image = image
          .flatten({
            background: "#ffffff",
          })
          .jpeg({
            quality: 95,
            mozjpeg: true,
          });
        break;

      case "png":
        image = image.png({
          compressionLevel: 9,
        });
        break;

      case "webp":
        image = image.webp({
          quality: 92,
        });
        break;

      case "avif":
        image = image.avif({
          quality: 80,
        });
        break;

      case "gif":
        image = image.gif();
        break;

      case "tiff":
      case "tif":
        image = image.tiff({
          quality: 90,
          compression: "lzw",
        });
        break;

      default:
        throw new Error(
          `Unsupported image output format: ${outputFormat}`,
        );
    }

    const buffer = await image.toBuffer();

    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
      gif: "image/gif",
      tiff: "image/tiff",
      tif: "image/tiff",
    };

    return {
      name:
        this.getBaseName(file.originalname) +
        "." +
        outputFormat,

      size: buffer.length,

      mimeType:
        mimeTypes[outputFormat] ??
        "application/octet-stream",

      data: buffer.toString("base64"),
    };
  }

  // =========================================================
  // DOCUMENT -> PDF
  // =========================================================

  private async convertDocumentToPdf(
    file: Express.Multer.File,
  ) {
    console.log(
      `[DOCUMENT] Converting ${file.originalname} -> PDF`,
    );

    const buffer = await libreConvert(
      file.buffer,
      ".pdf",
      undefined,
    );

    return {
      name:
        this.getBaseName(file.originalname) +
        ".pdf",

      size: buffer.length,

      mimeType: "application/pdf",

      data: buffer.toString("base64"),
    };
  }

  // =========================================================
  // PDF -> DOCX
  // =========================================================

  private async convertPdfToDocx(
    file: Express.Multer.File,
  ) {
    console.log(
      `[PDF] Converting ${file.originalname} -> DOCX`,
    );

    const id = randomUUID();

    const inputPath = join(
      tmpdir(),
      `${id}-input.pdf`,
    );

    const outputPath = join(
      tmpdir(),
      `${id}-output.docx`,
    );

    try {
      await fs.writeFile(
        inputPath,
        file.buffer,
      );

      await execFileAsync(
        "C:\\Users\\biso\\AppData\\Local\\Python\\pythoncore-3.14-64\\Scripts\\pdf2docx.exe",
        [
          "convert",
          inputPath,
          outputPath,
        ],
      );

      const buffer =
        await fs.readFile(outputPath);

      return {
        name:
          this.getBaseName(
            file.originalname,
          ) + ".docx",

        size: buffer.length,

        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        data: buffer.toString("base64"),
      };
    } finally {
      await fs
        .unlink(inputPath)
        .catch(() => {});

      await fs
        .unlink(outputPath)
        .catch(() => {});
    }
  }

  // =========================================================
  // AUDIO + VIDEO
  // =========================================================

  private async convertMedia(
    file: Express.Multer.File,
    inputFormat: string,
    outputFormat: string,
    type: "audio" | "video",
    signal?: AbortSignal,
  ) {
    console.log(
      `[MEDIA] Converting ${file.originalname}: ${inputFormat} -> ${outputFormat}`,
    );

    const id = randomUUID();

    const inputPath = join(
      tmpdir(),
      `${id}-input.${inputFormat}`,
    );

    const outputPath = join(
      tmpdir(),
      `${id}-output.${outputFormat}`,
    );

    try {
      await fs.writeFile(
        inputPath,
        file.buffer,
      );

      await new Promise<void>(
        (resolve, reject) => {
          let command =
            ffmpeg(inputPath);

          if (
            type === "audio" ||
            outputFormat === "mp3"
          ) {
            command =
              command.noVideo();
          }

          const handleAbort = () => {
            console.log(
              `[CANCELLED] ${file.originalname}`,
            );

            command.kill("SIGKILL");

            reject(
              new Error(
                "Conversion cancelled",
              ),
            );
          };

          if (signal?.aborted) {
            handleAbort();
            return;
          }

          signal?.addEventListener(
            "abort",
            handleAbort,
            {
              once: true,
            },
          );

          command
            .output(outputPath)

            .on("end", () => {
              signal?.removeEventListener(
                "abort",
                handleAbort,
              );

              resolve();
            })

            .on(
              "error",
              (error) => {
                signal?.removeEventListener(
                  "abort",
                  handleAbort,
                );

                reject(error);
              },
            )

            .run();
        },
      );

      const buffer =
        await fs.readFile(outputPath);

      const mimeTypes: Record<
        string,
        string
      > = {
        // Audio
        mp3: "audio/mpeg",
        wav: "audio/wav",
        flac: "audio/flac",
        ogg: "audio/ogg",
        aac: "audio/aac",
        m4a: "audio/mp4",

        // Video
        mp4: "video/mp4",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        webm: "video/webm",
        mkv: "video/x-matroska",
      };

      return {
        name:
          this.getBaseName(
            file.originalname,
          ) +
          "." +
          outputFormat,

        size: buffer.length,

        mimeType:
          mimeTypes[outputFormat] ??
          "application/octet-stream",

        data: buffer.toString(
          "base64",
        ),
      };
    } finally {
      await fs
        .unlink(inputPath)
        .catch(() => {});

      await fs
        .unlink(outputPath)
        .catch(() => {});
    }
  }

  // =========================================================
  // HELPER
  // =========================================================

private getBaseName(filename: string) {
  const decodedFilename = Buffer.from(
    filename,
    "latin1",
  ).toString("utf8");

  return decodedFilename.replace(
    /\.[^/.]+$/,
    "",
  );
}
}