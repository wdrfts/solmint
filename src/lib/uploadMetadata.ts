export async function uploadImageToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("type", "image");
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.url) throw new Error("Upload immagine fallito");
  return data.url;
}

export async function uploadMetadataToIPFS(metadata: object): Promise<string> {
  const formData = new FormData();
  formData.append("type", "metadata");
  formData.append("metadata", JSON.stringify(metadata));

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.url) throw new Error("Upload metadata fallito");
  return data.url;
}