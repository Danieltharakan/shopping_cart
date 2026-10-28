import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_QTY, MIN_QTY, type CartItem } from '../lib/cart'

type CartState = {
  items: CartItem[]
  add: (product: Omit<CartItem, 'quantity'>) => void
  remove: (id: number) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  clear: () => void
}

const changeQty = (items: CartItem[], id: number, delta: number) =>
  items.map((i) =>
    i.id === id ? { ...i, quantity: Math.min(MAX_QTY, Math.max(MIN_QTY, i.quantity + delta)) } : i,
  )

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((s) =>
          s.items.some((i) => i.id === product.id)
            ? { items: changeQty(s.items, product.id, 1) }
            : { items: [...s.items, { ...product, quantity: 1 }] },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      increase: (id) => set((s) => ({ items: changeQty(s.items, id, 1) })),
      decrease: (id) => set((s) => ({ items: changeQty(s.items, id, -1) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart' }, // localStorage key
  ),
)
