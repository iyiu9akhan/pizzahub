// Route handler: POST /api/upload
// Receives a multipart/form-data request with a "file" field,
// forwards it to ImgBB using the server-only IMGBB_API_KEY env var,
// and returns the hosted image URL.
// The API key is NEVER exposed to the browser.
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  // Read the uploaded file from the form data
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 })
  }

  // Validate type and size (JPG, PNG, WEBP — max 5 MB)
  const allowed = ["image/jpeg", "image/png", "image/webp"]
  if (!allowed.includes(file.type)) {
    return Response.json(
      { error: "Only JPG, PNG, or WEBP images are allowed" },
      { status: 400 }
    )
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 }
    )
  }

  // Read the ImgBB API key from server environment (never sent to browser)
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "Image upload is not configured" },
      { status: 500 }
    )
  }

  // Convert the file to base64 as required by the ImgBB API
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")

  // Forward to ImgBB
  const imgbbForm = new FormData()
  imgbbForm.append("image", base64)

  const imgbbRes = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    { method: "POST", body: imgbbForm }
  )

  const imgbbData = await imgbbRes.json()

  if (!imgbbRes.ok || !imgbbData?.data?.url) {
    return Response.json({ error: "ImgBB upload failed" }, { status: 500 })
  }

  // Return only the hosted URL to the browser
  return Response.json({ url: imgbbData.data.url as string })
}
