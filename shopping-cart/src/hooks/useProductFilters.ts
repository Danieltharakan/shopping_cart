import { useMemo, useState } from 'react'
import type { Product } from '../schemas'

export type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export function useProductFilters(products: Product[]) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [sort, setSort] = useState<Sort>('featured')

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products])
  const priceCeiling = useMemo(() => Math.ceil(Math.max(0, ...products.map((p) => p.price))), [products])
  const priceLimit = maxPrice ?? priceCeiling

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = products.filter(
      (p) => p.title.toLowerCase().includes(q) && (!category || p.category === category) && p.price <= priceLimit,
    )
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, search, category, priceLimit, sort])

  const clear = () => {
    setSearch('')
    setCategory('')
    setMaxPrice(null)
    setSort('featured')
  }

  return { search, setSearch, category, setCategory, sort, setSort, priceLimit, priceCeiling, setMaxPrice, categories, filtered, clear }
}
