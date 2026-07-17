import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { ConverterService } from "./converter.service";

@Controller("api/convert")
export class ConverterController {
  constructor(
    private readonly converterService: ConverterService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 1024,
      },
    }),
  )
  async convert(
    @UploadedFiles()
    files: Express.Multer.File[],

    @Body("outputFormats")
    outputFormats: string | string[],
  ) {
    const formats = Array.isArray(outputFormats)
      ? outputFormats
      : [outputFormats];

    console.log(
      "Files:",
      files.map((file) => file.originalname),
    );

    console.log(
      "Output formats:",
      formats,
    );

    return this.converterService.convert(
      files,
      formats,
    );
  }
}