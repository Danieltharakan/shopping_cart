export const MIN_QTY = 1
export const MAX_QTY = 5
export const TAX_RATE = 0.05
export const DISCOUNT_RATE = 0.1
export const DISCOUNT_THRESHOLD = 100
export const MIN_CHECKOUT = 10

export type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

const round = (n: number) => Math.round(n * 100) / 100

export function calcTotals(items: CartItem[]) {
  const subtotal = round(items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  const tax = round(subtotal * TAX_RATE)
  const discount = subtotal > DISCOUNT_THRESHOLD ? round(subtotal * DISCOUNT_RATE) : 0
  const total = round(subtotal + tax - discount)
  return { subtotal, tax, discount, total }
}

export const money = (n: number) => `$${n.toFixed(2)}`
