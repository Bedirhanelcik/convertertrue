export interface QueueFile {
  id: string;
  file: File;
  inputFormat: string;
  outputFormat: string | null;

  status:
    | "waiting"
    | "uploading"
    | "converting"
    | "completed"
    | "error";

  progress: number;

convertedFile?: {
  name: string;
  size: number;
  mimeType: string;
  data: string;
};
}