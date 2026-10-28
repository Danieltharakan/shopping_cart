import { useEffect } from 'react'
import { useCartStore } from '../store/cartStore'
import { MAX_QTY, MIN_CHECKOUT, MIN_QTY, calcTotals, money, type CartItem } from '../lib/cart'

export function Summary({ items }: { items: CartItem[] }) {
  const t = calcTotals(items)
  const row = (label: string, value: string, total = false) => (
    <div className={`flex justify-between ${total ? 'mt-3 border-t border-line pt-3 text-base' : 'text-mute'}`}>
      <span>{label}</span>
      <span className={total ? 'text-ink' : ''}>{value}</span>
    </div>
  )
  return (
    <div className="space-y-2 text-sm">
      {row('Subtotal', money(t.subtotal))}
      {row('Tax (5%)', money(t.tax))}
      {row('Discount (10% over $100)', `−${money(t.discount)}`)}
      {row('Total', money(t.total), true)}
    </div>
  )
}

const qtyBtn = 'h-7 w-7 border border-line text-sm transition hover:border-ink disabled:opacity-30 disabled:hover:border-line'

export default function Cart({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: () => void }) {
  const { items, remove, increase, decrease, clear } = useCartStore()
  const belowMin = calcTotals(items).subtotal < MIN_CHECKOUT

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-paper p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="display text-3xl">Your cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="eyebrow hover:text-ink">Close</button>
        </div>

        {items.length === 0 ? (
          <p className="my-auto text-center text-mute">Your cart is empty.</p>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-4">
                  <img src={i.thumbnail} alt="" className="h-20 w-16 bg-tint object-contain p-1" />
                  <div className="flex flex-1 flex-col text-sm">
                    <div className="flex justify-between gap-2">
                      <p>{i.title}</p>
                      <p>{money(i.price * i.quantity)}</p>
                    </div>
                    <p className="text-mute">{money(i.price)} each</p>
                    <div className="mt-auto flex items-center gap-3">
                      <button aria-label="Decrease quantity" className={qtyBtn} disabled={i.quantity <= MIN_QTY} onClick={() => decrease(i.id)}>−</button>
                      <span className="w-4 text-center">{i.quantity}</span>
                      <button aria-label="Increase quantity" className={qtyBtn} disabled={i.quantity >= MAX_QTY} onClick={() => increase(i.id)}>+</button>
                      <button className="eyebrow ml-auto hover:text-ink" onClick={() => remove(i.id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line pt-4">
              <Summary items={items} />
              {belowMin && <p className="mt-3 text-xs text-brass">Minimum checkout value is {money(MIN_CHECKOUT)}. Add more items to continue.</p>}
              <button disabled={belowMin} onClick={onCheckout} className="btn mt-4 w-full">Checkout</button>
              <button onClick={clear} className="eyebrow mt-3 w-full hover:text-ink">Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
