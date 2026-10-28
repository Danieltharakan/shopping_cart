import { useQuery } from '@tanstack/react-query'
import { productsResponseSchema } from '../schemas'

async function fetchProducts() {
  const res = await fetch('https://dummyjson.com/products?limit=100')
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return productsResponseSchema.parse(await res.json()).products
}

export const useProducts = () => useQuery({ queryKey: ['products'], queryFn: fetchProducts })
