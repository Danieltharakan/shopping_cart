import { useProducts } from '../hooks/useProducts'
import { useProductFilters, type Sort } from '../hooks/useProductFilters'
import { useCartStore } from '../store/cartStore'
import { MAX_QTY, money } from '../lib/cart'
import type { Product } from '../schemas'

const EMPTY: Product[] = []

export default function ProductList() {
  const { data, isPending, isError, error, refetch } = useProducts()
  const f = useProductFilters(data ?? EMPTY)
  const items = useCartStore((s) => s.items)
  const add = useCartStore((s) => s.add)

  if (isPending)
    return (
      <div role="status" aria-label="Loading products" className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5]" />
            <div className="skeleton mt-3 h-3 w-2/3" />
            <div className="skeleton mt-2 h-3 w-1/4" />
          </div>
        ))}
      </div>
    )

  if (isError)
    return (
      <div role="alert" className="py-24 text-center">
        <p className="display text-3xl">Something went wrong</p>
        <p className="mt-2 text-sm text-mute">Could not load products: {error.message}</p>
        <button onClick={() => refetch()} className="btn mt-6">Try again</button>
      </div>
    )

  return (
    <section>
      <div className="mb-10 grid gap-6 border-y border-line py-6 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-end">
        <input className="field" placeholder="Search products" aria-label="Search by title" value={f.search} onChange={(e) => f.setSearch(e.target.value)} />
        <select className="field capitalize" aria-label="Category" value={f.category} onChange={(e) => f.setCategory(e.target.value)}>
          <option value="">All categories</option>
          {f.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="field" aria-label="Sort" value={f.sort} onChange={(e) => f.setSort(e.target.value as Sort)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
        <label className="eyebrow flex flex-col gap-2">
          Up to {money(f.priceLimit)}
          <input type="range" className="accent-ink" min={0} max={f.priceCeiling} value={f.priceLimit} onChange={(e) => f.setMaxPrice(Number(e.target.value))} />
        </label>
        <button onClick={f.clear} className="eyebrow pb-2 underline-offset-4 hover:text-ink hover:underline">Clear</button>
      </div>

      <p className="eyebrow mb-6">{f.filtered.length} products</p>

      {f.filtered.length === 0 ? (
        <p className="py-24 text-center text-mute">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {f.filtered.map((p) => {
            const qty = items.find((i) => i.id === p.id)?.quantity ?? 0
            const full = qty >= MAX_QTY
            return (
              <article key={p.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-tint">
                  <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105" />
                  <button
                    disabled={full}
                    onClick={() => add({ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail })}
                    className="btn absolute inset-x-3 bottom-3 translate-y-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus:translate-y-0 sm:focus:opacity-100"
                  >
                    {full ? `Max ${MAX_QTY} in cart` : qty ? `Add another (${qty})` : 'Add to cart'}
                  </button>
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm">{p.title}</h3>
                    <p className="eyebrow mt-1 capitalize">{p.category}</p>
                  </div>
                  <p className="text-sm">{money(p.price)}</p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
