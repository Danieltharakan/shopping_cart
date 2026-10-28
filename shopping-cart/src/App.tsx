import { useState } from 'react'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Landing from './components/Landing'
import Login from './components/Login'
import { useCartStore } from './store/cartStore'
import { useAuthStore } from './store/authStore'

type View = 'home' | 'login' | 'shop' | 'checkout'

export default function App() {
  const [requested, setView] = useState<View>('home')
  const [cartOpen, setCartOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  // Route guard: shop and checkout need a signed-in user
  const view: View = !user && (requested === 'shop' || requested === 'checkout') ? 'login' : requested
  const afterLogin = requested === 'login' ? 'shop' : requested
  const link = 'eyebrow transition hover:text-ink'

  const go = (v: View) => {
    setView(v)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-5 py-4">
          <nav className="flex gap-6">
            <button onClick={() => go('home')} className={link}>Home</button>
            <button onClick={() => go('shop')} className={link}>Shop</button>
          </nav>
          <button onClick={() => go('home')} className="display justify-self-center text-2xl tracking-[0.3em]">ATELIER</button>
          <nav className="flex items-center justify-end gap-6">
            {user ? (
              <>
                <span className="eyebrow hidden sm:inline">Hi, {user.firstName}</span>
                <button onClick={() => { logout(); go('home') }} className={link}>Log out</button>
              </>
            ) : (
              <button onClick={() => go('login')} className={link}>Log in</button>
            )}
            <button onClick={() => setCartOpen(true)} className={link}>Cart ({count})</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
        {view === 'home' && <Landing onShop={() => go('shop')} />}
        {view === 'login' && <Login onSuccess={() => go(afterLogin)} />}
        {view === 'shop' && (
          <>
            <h1 className="display mb-8 text-5xl">The collection</h1>
            <ProductList />
          </>
        )}
        {view === 'checkout' && <Checkout onExit={() => go('shop')} />}
      </main>

      <footer className="border-t border-line py-8 text-center">
        <p className="display text-xl tracking-[0.3em]">ATELIER</p>
        <p className="eyebrow mt-2">Considered objects · Demo store</p>
      </footer>

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); go('checkout') }} />
    </div>
  )
}
