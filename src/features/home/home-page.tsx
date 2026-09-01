import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { PriceDisplay } from '@/components/common/price-display'
import { SectionHeading } from '@/components/common/section-heading'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categories } from '@/data/categories'
import { reasons, trustStats } from '@/data/content'
import { products } from '@/data/products'
import { getMediaUrl } from '@/lib/media'
import { toast } from 'sonner'

export function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const trending = products.filter((product) => product.trending).slice(0, 8)

  return (
    <div>
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80"
          alt="Editorial portrait in a linen shirt beside a sunlit interior"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/35 to-transparent" />
        <div className="container-page relative flex min-h-[78vh] items-end pb-16 pt-28 md:items-center md:py-24">
          <div className="max-w-xl text-background">
            <p className="text-caption text-background/70">Spring studio edit</p>
            <h1 className="text-display mt-4">Pieces that stay. Rooms that breathe.</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-background/80 sm:text-base">
              Apparel, home, and fragrance chosen for material, cut, and how they live — not how they trend.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">Shop the collection</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/products" search={{ category: 'cat-home' }}>
                  Explore home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <SectionHeading
          eyebrow="The house"
          title="Shop by atmosphere"
          description="Four rooms of the store — each edited with the same restraint."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-12">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to="/products"
              search={{ category: category.id }}
              className={
                index === 0
                  ? 'group relative min-h-72 overflow-hidden rounded-2xl md:col-span-7 md:min-h-[22rem]'
                  : index === 1
                    ? 'group relative min-h-72 overflow-hidden rounded-2xl md:col-span-5'
                    : 'group relative min-h-64 overflow-hidden rounded-2xl md:col-span-6'
              }
            >
              <img
                src={getMediaUrl(category.image, 1100)}
                alt={category.image.alt}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                <p className="text-caption text-background/70">{category.name}</p>
                <p className="mt-1 font-display text-2xl">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 md:pb-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured" title="The studio edit" />
          <Button asChild variant="ghost">
            <Link to="/products">
              View all <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categories.find((category) => category.id === product.categoryId)}
            />
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Trending" title="What people are taking home" />
          <div className="mt-10 flex gap-5 overflow-x-auto pb-2 snap-x">
            {trending.map((product) => {
              const image = product.media[0]
              return (
                <Link
                  key={product.id}
                  to="/products/$productId"
                  params={{ productId: product.id }}
                  className="w-[220px] shrink-0 snap-start sm:w-[240px]"
                >
                  {image ? (
                    <img
                      src={getMediaUrl(image, 480)}
                      alt={image.alt}
                      className="aspect-[4/5] w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <p className="mt-3 text-product-title">{product.name}</p>
                  <PriceDisplay className="mt-1" size="sm" price={product.price} />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&w=1200&q=80"
            alt="Warm interior with a brass lamp and linen chair"
            className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
          />
        </div>
        <div className="md:pl-6">
          <p className="text-caption">A private sale</p>
          <h2 className="text-section mt-3">Complimentary shipping on orders over $150.</h2>
          <p className="mt-4 max-w-md text-small">
            Plastic-free packaging, carbon-neutral delivery, and thirty days to live with a piece before you decide.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link to="/products" search={{ sort: 'featured' }}>
              Shop with complimentary shipping
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="container-page grid gap-10 py-16 md:grid-cols-4 md:py-20">
          {reasons.map((reason) => (
            <div key={reason.title}>
              <h3 className="font-display text-xl">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-caption">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-foreground py-16 text-background md:py-20">
        <div className="container-page max-w-2xl text-center">
          <p className="text-caption text-background/50">The journal</p>
          <h2 className="text-section mt-3 text-background">Studio notes, twice a month.</h2>
          <p className="mt-3 text-sm text-background/70">
            New arrivals, material stories, and the occasional private preview. No filler.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              toast.success('Welcome to the list.')
              event.currentTarget.reset()
            }}
          >
            <label className="sr-only" htmlFor="home-newsletter">
              Email
            </label>
            <Input
              id="home-newsletter"
              type="email"
              required
              placeholder="you@studio.com"
              className="border-background/20 bg-background/8 text-background placeholder:text-background/50"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
