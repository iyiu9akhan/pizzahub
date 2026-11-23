// imgbb upload
import { getSession } from "@/lib/core/server"
import { uploadToImgBB } from "@/lib/core/imgbb"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user) {
    return Response.json({ error: "Not logged in" }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const file = formData?.get("file") as File | null

  if (!file || !(file instanceof File) || file.size === 0) {
    return Response.json(
      { error: "Invalid image type or size" },
      { status: 400 }
    )
  }

  try {
    const url = await uploadToImgBB(file)
    return Response.json({ url })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image"
    const status = message === "Image host key is missing" ? 500 : 400
    return Response.json({ error: message }, { status })
  }
}
