import "server-only"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

/**
 * Server-only helper to upload an image to ImgBB.
 * Validates file format and size, forwards to the ImgBB API,
 * and returns the hosted image URL.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error("Invalid image type or size")
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
    throw new Error("Invalid image type or size")
  }

  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    throw new Error("Image host key is missing")
  }

  // Create multipart/form-data with field "image"
  const formData = new FormData()
  formData.append("image", file)

  let response: Response
  try {
    response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: formData,
      }
    )
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Network error"
    throw new Error(`ImgBB upload failed (${reason})`)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.data?.url) {
    const reason =
      data?.error?.message ||
      (typeof data?.error === "string" ? data.error : `HTTP ${response.status}`)
    throw new Error(`ImgBB upload failed (${reason})`)
  }

  return (data.data.url as string) || (data.data.display_url as string)
}
