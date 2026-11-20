// Type definitions for login form fields and component props.
export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  className?: string
  onSubmit?: (data: LoginFormData) => void
}
