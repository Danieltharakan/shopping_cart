import { describe, expect, it } from 'vitest'
import { calcTotals, type CartItem } from './cart'

const item = (price: number, quantity: number): CartItem => ({ id: 1, title: 't', price, thumbnail: '', quantity })

describe('calcTotals', () => {
  it('adds 5% tax and no discount at or below $100', () => {
    expect(calcTotals([item(100, 1)])).toEqual({ subtotal: 100, tax: 5, discount: 0, total: 105 })
  })
  it('applies 10% discount above $100', () => {
    expect(calcTotals([item(50, 3)])).toEqual({ subtotal: 150, tax: 7.5, discount: 15, total: 142.5 })
  })
  it('handles an empty cart', () => {
    expect(calcTotals([])).toEqual({ subtotal: 0, tax: 0, discount: 0, total: 0 })
  })
})
