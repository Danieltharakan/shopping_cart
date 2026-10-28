import { useProducts } from '../hooks/useProducts'
import { money } from '../lib/cart'

const VALUES = [
  ['10% off', 'On every order over $100, applied automatically.'],
  ['Secure sign-in', 'Token-based authentication keeps your cart yours.'],
  ['Simple checkout', 'Review, ship and confirm in three quiet steps.'],
]

export default function Landing({ onShop }: { onShop: () => void }) {
  const { data, isPending, isError } = useProducts()
  const ranked = [...(data ?? [])].sort((a, b) => b.rating - a.rating)
  const hero = ranked[0]
  const featured = ranked.slice(1, 5)

  return (
    <div>
      <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-20">
        <div>
          <p className="eyebrow">New season — curated edit</p>
          <h1 className="display mt-5 text-5xl sm:text-7xl">Considered objects for everyday life.</h1>
          <p className="mt-6 max-w-md text-mute">A small, well-chosen collection of the highest-rated pieces. Nothing loud, nothing extra.</p>
          <div className="mt-8 flex gap-4">
            <button onClick={onShop} className="btn">Shop the collection</button>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-tint">
          {hero ? (
            <>
              <img src={hero.thumbnail} alt={hero.title} className="h-full w-full object-contain p-10" />
              <div className="absolute bottom-4 left-4 bg-paper px-4 py-3 text-sm">
                <p className="eyebrow">Most loved</p>
                <p className="mt-1">{hero.title} · {money(hero.price)}</p>
              </div>
            </>
          ) : (
            <div className="skeleton h-full w-full" />
          )}
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="display text-4xl">Top rated</h2>
          <button onClick={onShop} className="eyebrow underline-offset-4 hover:text-ink hover:underline">View all</button>
        </div>
        {isError && <p role="alert" className="text-mute">Could not load featured products.</p>}
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {isPending
            ? Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton aspect-[4/5]" />)
            : featured.map((p) => (
                <article key={p.id} className="group cursor-pointer" onClick={onShop}>
                  <div className="aspect-[4/5] overflow-hidden bg-tint">
                    <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-3 flex justify-between gap-3 text-sm">
                    <h3>{p.title}</h3>
                    <p>{money(p.price)}</p>
                  </div>
                  <p className="eyebrow mt-1">★ {p.rating.toFixed(1)}</p>
                </article>
              ))}
        </div>
      </section>

      <section className="grid gap-10 border-t border-line py-16 md:grid-cols-3">
        {VALUES.map(([title, text], i) => (
          <div key={title}>
            <p className="font-display text-brass text-2xl">0{i + 1}</p>
            <h3 className="display mt-2 text-2xl">{title}</h3>
            <p className="mt-2 text-sm text-mute">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
