export const useCloudinary = () => {
  const config = useRuntimeConfig()

  const uploadFile = async (file: File): Promise<{ url: string; publicId: string } | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', config.public.cloudinaryUploadPreset)
    formData.append('folder', 'bfar-fms') // organizes files in Cloudinary

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/auto/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()
      return {
        url: data.secure_url,
        publicId: data.public_id,
      }
    } catch (e) {
      console.error('Cloudinary upload failed:', e)
      return null
    }
  }

  return { uploadFile }
}