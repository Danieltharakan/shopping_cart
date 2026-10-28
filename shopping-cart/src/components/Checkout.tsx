import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { MIN_CHECKOUT, calcTotals, money } from '../lib/cart'
import { shippingSchema, type Shipping } from '../schemas'
import { Summary } from './Cart'

const STEPS = ['Cart review', 'Shipping', 'Payment summary']
const FIELDS: { name: keyof Shipping; label: string; type?: string; wide?: boolean }[] = [
  { name: 'fullName', label: 'Full name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone number', type: 'tel' },
  { name: 'postalCode', label: 'Postal code' },
  { name: 'address', label: 'Address', wide: true },
  { name: 'city', label: 'City' },
]
const emptyShipping: Shipping = { fullName: '', email: '', phone: '', address: '', city: '', postalCode: '' }

type Errors = Partial<Record<keyof Shipping, string>>

function ItemList() {
  const items = useCartStore((s) => s.items)
  return (
    <>
      <ul className="mb-6 divide-y divide-line text-sm">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 py-3">
            <img src={i.thumbnail} alt="" className="h-14 w-12 bg-tint object-contain p-1" />
            <span className="flex-1">{i.title} <span className="text-mute">× {i.quantity}</span></span>
            <span>{money(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <Summary items={items} />
    </>
  )
}

export default function Checkout({ onExit }: { onExit: () => void }) {
  const { items, clear } = useCartStore()
  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState<Shipping>(emptyShipping)
  const [errors, setErrors] = useState<Errors>({})
  const [placed, setPlaced] = useState(false)

  if (placed)
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="display mt-4 text-5xl">Thank you, {shipping.fullName.split(' ')[0]}.</h1>
        <p className="mt-4 text-mute">Your order has been placed successfully.</p>
        <button onClick={onExit} className="btn mt-8">Continue shopping</button>
      </div>
    )

  const cartValid = items.length > 0 && calcTotals(items).subtotal >= MIN_CHECKOUT

  const next = () => {
    if (step === 0 && !cartValid) return
    if (step === 1) {
      const result = shippingSchema.safeParse(shipping)
      if (!result.success) {
        const e: Errors = {}
        for (const issue of result.error.issues) e[issue.path[0] as keyof Shipping] ??= issue.message
        setErrors(e)
        return
      }
      setErrors({})
    }
    setStep(step + 1)
  }

  const placeOrder = () => {
    clear()
    setPlaced(true)
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      <ol className="mb-10 grid grid-cols-3 gap-3">
        {STEPS.map((s, i) => (
          <li key={s} className={`border-t-2 pt-3 ${i <= step ? 'border-ink' : 'border-line'}`}>
            <p className="eyebrow">0{i + 1}</p>
            <p className={`text-sm ${i === step ? '' : 'text-mute'}`}>{s}</p>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <>
          {items.length === 0 ? <p className="text-mute">Your cart is empty.</p> : <ItemList />}
          {!cartValid && items.length > 0 && <p className="mt-3 text-xs text-brass">Minimum checkout value is {money(MIN_CHECKOUT)}.</p>}
        </>
      )}

      {step === 1 && (
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {FIELDS.map(({ name, label, type, wide }) => (
            <label key={name} className={`eyebrow block ${wide ? 'sm:col-span-2' : ''}`}>
              {label}
              <input type={type ?? 'text'} value={shipping[name]} onChange={(e) => setShipping({ ...shipping, [name]: e.target.value })} className="field mt-2 normal-case tracking-normal text-ink" />
              {errors[name] && <span role="alert" className="mt-1 block text-xs normal-case tracking-normal text-brass">{errors[name]}</span>}
            </label>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="text-sm">
            <p className="eyebrow mb-2">Shipping to</p>
            <p>{shipping.fullName} · {shipping.email} · {shipping.phone}</p>
            <p className="text-mute">{shipping.address}, {shipping.city} {shipping.postalCode}</p>
          </div>
          <ItemList />
        </div>
      )}

      <div className="mt-10 flex justify-between">
        <button onClick={() => (step === 0 ? onExit() : setStep(step - 1))} className="btn-ghost">{step === 0 ? 'Back to shop' : 'Back'}</button>
        {step < 2 ? (
          <button onClick={next} disabled={step === 0 && !cartValid} className="btn">Next</button>
        ) : (
          <button onClick={placeOrder} className="btn">Place order</button>
        )}
      </div>
    </div>
  )
}
