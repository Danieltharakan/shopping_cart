import { z } from 'zod'

// API response validation
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: z.string(),
  price: z.number(),
  rating: z.number(),
  thumbnail: z.string(),
})
export const productsResponseSchema = z.object({ products: z.array(productSchema) })
export type Product = z.infer<typeof productSchema>

// Shipping form validation
export const shippingSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  address: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
})
export type Shipping = z.infer<typeof shippingSchema>

// Login form + auth API response
export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const authResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  accessToken: z.string(),
})
