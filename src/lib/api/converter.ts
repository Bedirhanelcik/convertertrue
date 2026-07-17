export async function uploadFiles(
  files: File[],
  outputFormat: string
) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("outputFormat", outputFormat);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/convert`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Conversion failed");
  }

  return response.json();
}