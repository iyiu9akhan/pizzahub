// Type definitions for menu item creation and editing form values.
export interface AddMenuItemFormValues {
  itemName: string
  category: string
  description: string
  price: number
  location: string
  images: File[]
  existingImages: string[]
  vendorId?: string
  vendorName?: string
  status?: string
}
