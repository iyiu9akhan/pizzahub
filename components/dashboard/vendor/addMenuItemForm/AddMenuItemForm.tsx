"use client"

import React, { useEffect, useRef, useState } from "react"
import { z } from "zod"
import {
  Banknote,
  Check,
  Eye,
  FileText,
  ImagePlus,
  Images,
  MapPin,
  Star,
  X,
} from "lucide-react"
import { formatUSD } from "@/lib/format"
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import LoadingButton from "@/components/ui/LoadingButton"

export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export const PRESET_IMAGES = [1, 2, 3, 4, 5, 6].map(
  (n) => `/images/addMenu-items-img/item-${n}.jpg`
)

const LOCATIONS = [
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Mohammadpur, Dhaka",
  "Bashundhara, Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
]

export interface AddMenuItemFormProps {
  mode?: "create" | "edit"
  defaultValues?: Partial<
    Omit<AddMenuItemFormValues, "images" | "existingImages">
  > & { imageUrls?: string[] }
  onSubmit: (values: AddMenuItemFormValues) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

type FieldKey =
  "itemName" | "category" | "description" | "price" | "location" | "images"
type FormErrors = Partial<Record<FieldKey, string>>

interface ImageEntry {
  id: string
  preview: string
  file?: File
  url?: string
}

const MAX_IMAGES = 4
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_DESCRIPTION = 500
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

const fieldBase =
  "h-12 w-full rounded-xl border bg-surface px-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
const labelCls = "mb-2 block font-heading text-sm font-semibold text-ink"
const cardCls = "rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"

const makeId = () => Math.random().toString(36).slice(2, 10)

const CardTitle = ({
  title,
  hint,
  icon: Icon,
}: {
  title: string
  hint?: string
  icon: React.ElementType
}) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <h3 className="font-heading text-base font-bold text-ink">{title}</h3>
      {hint && (
        <p className="mt-0.5 font-text text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  </div>
)

const AddMenuItemForm: React.FC<AddMenuItemFormProps> = ({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [itemName, setItemName] = useState(defaultValues?.itemName ?? "")
  const [category, setCategory] = useState(defaultValues?.category ?? "")
  const [description, setDescription] = useState(
    defaultValues?.description ?? ""
  )
  const [price, setPrice] = useState(
    defaultValues?.price !== undefined ? String(defaultValues.price) : ""
  )
  const [location, setLocation] = useState(defaultValues?.location ?? "")
  const [imageList, setImageList] = useState<ImageEntry[]>(
    (defaultValues?.imageUrls ?? []).map((url) => ({
      id: makeId(),
      preview: url,
      url,
    }))
  )
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const imageListRef = useRef<ImageEntry[]>(imageList)

  useEffect(() => {
    imageListRef.current = imageList
  }, [imageList])

  useEffect(() => {
    return () => {
      imageListRef.current.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.preview)
      })
    }
  }, [])

  const clearError = (key: FieldKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const addFiles = (fileList: FileList | File[] | null | undefined) => {
    if (!fileList) return
    const incoming = Array.from(fileList)
    if (incoming.length === 0) return

    const remaining = MAX_IMAGES - imageList.length
    if (remaining <= 0) {
      setErrors((p) => ({
        ...p,
        images: `You can add up to ${MAX_IMAGES} images`,
      }))
      return
    }

    let errorMsg = ""
    const accepted: ImageEntry[] = []
    for (const file of incoming) {
      if (accepted.length >= remaining) {
        errorMsg = `You can add up to ${MAX_IMAGES} images`
        break
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        errorMsg = "Only JPG, PNG or WEBP images are allowed"
        continue
      }
      if (file.size > MAX_IMAGE_SIZE) {
        errorMsg = "Each image must be smaller than 5MB"
        continue
      }
      accepted.push({ id: makeId(), file, preview: URL.createObjectURL(file) })
    }
    if (accepted.length > 0) setImageList((prev) => [...prev, ...accepted])
    setErrors((p) => ({ ...p, images: errorMsg || undefined }))
  }

  const togglePreset = (url: string) => {
    const existing = imageList.find((i) => i.url === url)
    if (existing) {
      removeImage(existing.id)
      return
    }
    if (imageList.length >= MAX_IMAGES) {
      setErrors((p) => ({
        ...p,
        images: `You can add up to ${MAX_IMAGES} images`,
      }))
      return
    }
    setImageList((prev) => [...prev, { id: makeId(), preview: url, url }])
    clearError("images")
  }

  const removeImage = (id: string) => {
    setImageList((prev) => {
      const target = prev.find((i) => i.id === id)
      if (target?.file) URL.revokeObjectURL(target.preview)
      return prev.filter((i) => i.id !== id)
    })
    clearError("images")
  }

const menuItemZodSchema = z.object({
  itemName: z.string().trim().min(3, "Item name must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be greater than 0"),
  location: z.string().trim().min(1, "Location is required"),
  imagesCount: z.number().min(1, "At least one image is required"),
})

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    const result = menuItemZodSchema.safeParse({
      itemName: itemName.trim(),
      category,
      description: description.trim(),
      price: price ? Number(price) : 0,
      location: location.trim(),
      imagesCount: imageList.length,
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      if (fieldErrors.itemName) e.itemName = fieldErrors.itemName[0]
      if (fieldErrors.category) e.category = fieldErrors.category[0]
      if (fieldErrors.description) e.description = fieldErrors.description[0]
      if (fieldErrors.price) e.price = fieldErrors.price[0]
      if (fieldErrors.location) e.location = fieldErrors.location[0]
      if (fieldErrors.imagesCount) e.images = fieldErrors.imagesCount[0]
    }
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    const order: FieldKey[] = [
      "itemName",
      "category",
      "description",
      "price",
      "location",
      "images",
    ]
    const firstError = order.find((k) => validationErrors[k])
    if (firstError) {
      const el = formRef.current?.querySelector<HTMLElement>(
        `[data-field="${firstError}"]`
      )
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      el?.focus({ preventScroll: true })
      return
    }

    await onSubmit({
      itemName: itemName.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      location: location.trim(),
      images: imageList.filter((i) => i.file).map((i) => i.file as File),
      existingImages: imageList
        .filter((i) => i.url)
        .map((i) => i.url as string),
    })
  }

  const borderFor = (key: FieldKey) =>
    errors[key] ? "border-red-500" : "border-line"

  const renderError = (key: FieldKey) =>
    errors[key] ? (
      <p role="alert" className="mt-1.5 font-text text-xs text-red-500">
        {errors[key]}
      </p>
    ) : null

  const priceNumber = Number(price)
  const canAddMore = imageList.length < MAX_IMAGES
  const coverImage = imageList[0]?.preview

  return (
    /*
      @container: layout responds to the width of the CONTENT AREA
      (not the window), so it adapts when the sidebar opens/collapses.
        < @4xl  (896px)  → 1 column
        @4xl–@6xl        → 2 columns (form | images + preview)
        ≥ @6xl (1152px)  → 3 columns (form | images | preview)
    */
    <div className="@container w-full">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="grid w-full grid-cols-1 gap-6 @4xl:grid-cols-[minmax(0,1fr)_340px] @6xl:grid-cols-[minmax(0,1fr)_330px_320px] @[100rem]:grid-cols-[minmax(0,1fr)_360px_340px]"
      >
        {/* ───────── Column 1: details ───────── */}
        <div className="min-w-0 space-y-6">
          {/* Basic info */}
          <section className={cardCls}>
            <CardTitle
              icon={FileText}
              title="Basic information"
              hint="Name, category and a short description."
            />
            <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2">
              <div>
                <label htmlFor="itemName" className={labelCls}>
                  Item name <span className="text-red-500">*</span>
                </label>
                <input
                  id="itemName"
                  data-field="itemName"
                  type="text"
                  value={itemName}
                  disabled={isSubmitting}
                  placeholder="e.g. Margherita Supreme"
                  onChange={(e) => {
                    setItemName(e.target.value)
                    clearError("itemName")
                  }}
                  className={`${fieldBase} ${borderFor("itemName")}`}
                />
                {renderError("itemName")}
              </div>

              <div>
                <label htmlFor="category" className={labelCls}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  data-field="category"
                  value={category}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    clearError("category")
                  }}
                  className={`${fieldBase} ${borderFor("category")}`}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {MENU_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {renderError("category")}
              </div>

              <div className="@2xl:col-span-2">
                <label htmlFor="description" className={labelCls}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  data-field="description"
                  rows={6}
                  maxLength={MAX_DESCRIPTION}
                  value={description}
                  disabled={isSubmitting}
                  placeholder="Ingredients, size, taste and anything customers should know..."
                  onChange={(e) => {
                    setDescription(e.target.value)
                    clearError("description")
                  }}
                  className={`${fieldBase} h-auto resize-none py-3 ${borderFor("description")}`}
                />
                <div className="mt-1.5 flex items-start justify-between gap-3">
                  <div>{renderError("description")}</div>
                  <span className="ml-auto shrink-0 font-text text-xs text-ink-muted">
                    {description.length}/{MAX_DESCRIPTION}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & location */}
          <section className={cardCls}>
            <CardTitle
              icon={Banknote}
              title="Pricing & location"
              hint="All prices are in US Dollars (USD)."
            />
            <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelCls}>
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-text text-sm font-semibold text-ink-muted">
                    $
                  </span>
                  <input
                    id="price"
                    data-field="price"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={price}
                    disabled={isSubmitting}
                    placeholder="e.g. 50"
                    onChange={(e) => {
                      setPrice(e.target.value)
                      clearError("price")
                    }}
                    className={`${fieldBase} pl-9 ${borderFor("price")}`}
                  />
                </div>
                {priceNumber > 0 && (
                  <p className="mt-1.5 font-text text-xs text-ink-muted">
                    Customers will see{" "}
                    <span className="font-semibold text-ink">
                      {formatUSD(priceNumber)}
                    </span>
                  </p>
                )}
                {renderError("price")}
              </div>

              <div>
                <label htmlFor="location" className={labelCls}>
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  data-field="location"
                  type="text"
                  list="location-options"
                  value={location}
                  disabled={isSubmitting}
                  placeholder="Select or type an area"
                  onChange={(e) => {
                    setLocation(e.target.value)
                    clearError("location")
                  }}
                  className={`${fieldBase} ${borderFor("location")}`}
                />
                <datalist id="location-options">
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l} />
                  ))}
                </datalist>
                {renderError("location")}
              </div>
            </div>
          </section>
        </div>

        {/*
          Images + Preview wrapper.
          2-col mode: stacked in the right column.
          3-col mode (@6xl): `contents` makes each child its own grid column.
        */}
        <aside className="min-w-0 space-y-6 @4xl:sticky @4xl:top-20 @4xl:self-start @6xl:contents">
          {/* ───────── Images ───────── */}
          <section
            className={`${cardCls} @6xl:sticky @6xl:top-20 @6xl:self-start`}
          >
            <CardTitle
              icon={Images}
              title="Item images"
              hint={`Up to ${MAX_IMAGES} images. First one is the cover.`}
            />

            <div
              data-field="images"
              tabIndex={-1}
              className="grid grid-cols-2 gap-3 outline-none"
            >
              {imageList.map((img, index) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-line bg-brand-soft/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt={`Item image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 font-heading text-[10px] font-bold text-white">
                      <Star className="h-3 w-3 fill-white" />
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    disabled={isSubmitting}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-brand"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {canAddMore && (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload image"
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    addFiles(e.dataTransfer.files)
                  }}
                  className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-2 text-center transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none ${
                    isDragging
                      ? "border-brand bg-brand-soft"
                      : errors.images
                        ? "border-red-500"
                        : "border-line hover:border-brand hover:bg-brand-soft/30"
                  }`}
                >
                  <ImagePlus className="h-6 w-6 text-brand-fg" />
                  <p className="font-heading text-xs font-semibold text-ink">
                    Upload
                  </p>
                  <p className="font-text text-[11px] text-ink-muted">
                    or drag & drop
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ""
              }}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <div>{renderError("images")}</div>
              <span className="ml-auto shrink-0 font-text text-xs text-ink-muted">
                {imageList.length}/{MAX_IMAGES}
              </span>
            </div>

            {/* Gallery */}
            <div className="mt-5 border-t border-line pt-4">
              <p className="mb-2 font-heading text-xs font-semibold text-ink">
                Or choose from gallery
              </p>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_IMAGES.map((src) => {
                  const selected = imageList.some((i) => i.url === src)
                  return (
                    <button
                      key={src}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => togglePreset(src)}
                      aria-pressed={selected}
                      aria-label="Select gallery image"
                      className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                        selected
                          ? "border-brand ring-2 ring-brand/30"
                          : "border-transparent hover:border-brand"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      {selected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-brand/40">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ───────── Live preview ───────── */}
          <section
            className={`${cardCls} @6xl:sticky @6xl:top-20 @6xl:self-start`}
          >
            <CardTitle
              icon={Eye}
              title="Live preview"
              hint="How customers will see this item."
            />

            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <div className="relative aspect-4/3 bg-brand-soft/40">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt="Preview cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted">
                    <ImagePlus className="h-8 w-8" />
                    <span className="font-text text-xs">No image selected</span>
                  </div>
                )}
                {category && (
                  <span className="absolute top-3 left-3 max-w-[85%] truncate rounded-full bg-white/95 px-3 py-1 font-heading text-[11px] font-bold text-brand-fg shadow">
                    {category}
                  </span>
                )}
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 font-heading text-base font-extrabold wrap-break-word text-ink">
                    {itemName.trim() || "Item name"}
                  </h4>
                  <span className="shrink-0 font-heading text-lg font-extrabold text-brand-fg">
                    {priceNumber > 0 ? formatUSD(priceNumber) : "৳ 0"}
                  </span>
                </div>
                <p className="line-clamp-2 font-text text-xs leading-relaxed wrap-break-word text-ink-muted">
                  {description.trim() ||
                    "Your item description will appear here."}
                </p>
                <div className="flex items-center gap-1.5 pt-1 font-text text-xs text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-fg" />
                  <span className="truncate">
                    {location.trim() || "Location"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </aside>

        {/* ───────── Actions ───────── */}
        <div className="col-span-full flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface px-7 font-heading text-sm font-semibold text-ink transition-colors hover:bg-brand-soft/40 disabled:opacity-60"
            >
              Cancel
            </button>
          )}
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Saving…"
            className="inline-flex h-12 min-w-44 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-7 font-heading text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {mode === "create" ? "Add menu item" : "Save changes"}
          </LoadingButton>
        </div>
      </form>
    </div>
  )
}

export default AddMenuItemForm
