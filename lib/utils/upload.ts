// Client-side helper for uploading a file to /api/upload proxy (ImgBB)
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) {
    throw new Error(data?.error || "Image upload failed")
  }

  return data.url as string
}
