// Centralized toast helpers so every action uses the same message style.
// Import from here instead of calling sonner's toast directly.
import { toast } from "sonner"

// Show a green success toast
export const toastSuccess = (message: string) => toast.success(message)

// Show a red error toast
export const toastError = (message: string, description?: string) =>
  toast.error(message, { description })

// Show a neutral/info toast
export const toastInfo = (message: string, description?: string) =>
  toast.info(message, { description })

// Wrap a promise: shows "loading" → "success" or "error" automatically
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) =>
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  })
