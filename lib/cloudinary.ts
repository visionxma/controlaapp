export interface CloudinaryUploadResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  access_mode: string
  original_filename: string
}

export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    console.log("[v0] Uploading image to Cloudinary:", file.name)

    const formData = new FormData()
    formData.append("file", file)
    // For now, we'll skip Cloudinary upload and return empty string
    // formData.append("upload_preset", "unsigned_uploads")

    console.log("[v0] Skipping Cloudinary upload - no valid preset configured")
    console.log("[v0] Product will be saved without image")
    return ""

    /* Commented out until proper Cloudinary preset is configured
    const response = await fetch("https://api.cloudinary.com/v1_1/dqvjdppqs/image/upload", {
      method: "POST",
      body: formData,
    })

    console.log("[v0] Cloudinary response status:", response.status)
    console.log("[v0] Cloudinary response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Cloudinary error response:", errorText)
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data: CloudinaryUploadResponse = await response.json()
    console.log("[v0] Cloudinary upload successful:", data.secure_url)

    return data.secure_url
    */
  } catch (error) {
    console.error("[v0] Error uploading to Cloudinary:", error)
    console.log("[v0] Returning empty imageUrl due to upload failure")
    return "" // Fallback to return empty string instead of throwing error to prevent form submission failure
  }
}

export function getOptimizedImageUrl(url: string, width?: number, height?: number, quality?: number): string {
  if (!url.includes("cloudinary.com")) {
    return url // Return original URL if not a Cloudinary URL
  }

  const transformations = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (quality) transformations.push(`q_${quality}`)

  if (transformations.length === 0) return url

  // Insert transformations into Cloudinary URL
  const transformString = transformations.join(",")
  return url.replace("/upload/", `/upload/${transformString}/`)
}
