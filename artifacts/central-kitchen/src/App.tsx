import { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Facebook,
  Flame,
  Home as HomeIcon,
  Info,
  Leaf,
  Mail,
  MessageCircle,
  MapPin,
  Plus,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Instagram,
  ShieldCheck,
  Timer,
  Utensils,
  UserRound,
  X,
  ClipboardList,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  tone: string;
};

const restaurants: Restaurant[] = [
  {
    id: 'f3',
    name: 'F3 - Fit Fury Fusion',
    cuisine: 'Bowls · 25 min',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    tone: 'bg-[#e6b35a]',
  },
  {
    id: 'spicy-wicy',
    name: 'Spicy Wicy - Dicey',
    cuisine: 'Indian · 30 min',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    tone: 'bg-[#ed8766]',
  },
  {
    id: 'chai-poha',
    name: 'Chai Poha aur Bun-maska',
    cuisine: 'Breakfast · 20 min',
    image: 'https://images.pexels.com/photos/5410401/pexels-photo-5410401.jpeg?auto=compress&cs=tinysrgb&w=400',
    tone: 'bg-[#e8c99e]',
  },
  {
    id: 'bowls',
    name: 'Bowls on Meals',
    cuisine: 'Asian · 25 min',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    tone: 'bg-[#91b7a4]',
  },
  {
    id: 'juice-and-milkshakes',
    name: 'Juice and Milkshakes',
    cuisine: 'Juices · 15 min',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400',
    tone: 'bg-[#f2b36f]',
  },
];

type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
};

const healthyFood: FoodItem[] = [
  {
    id: 'green-goddess',
    name: 'Green Goddess Bowl',
    description: 'Avocado, edamame, greens, sesame crunch',
    price: 285,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=650',
    tag: 'F3 pick',
  },
  {
    id: 'rainbow-paneer',
    name: 'Rainbow Paneer Plate',
    description: 'Charred paneer, millet, bright seasonal sides',
    price: 310,
    image: 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=650',
    tag: 'Fresh today',
  },
  {
    id: 'miso-soba',
    name: 'Miso Soba Garden',
    description: 'Buckwheat noodles, greens, ginger miso',
    price: 265,
    image: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=650',
    tag: 'Light & bright',
  },
];

const spicyFood: FoodItem[] = [
  {
    id: 'fire-chicken',
    name: 'Firecracker Chicken',
    description: 'Crispy chicken, chilli glaze, spring onion',
    price: 325,
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=650',
    tag: 'Hot favourite',
  },
  {
    id: 'tandoori-tacos',
    name: 'Tandoori Tacos',
    description: 'Smoky tikka, mint crema, pickled onion',
    price: 295,
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=650',
    tag: 'Staff pick',
  },
  {
    id: 'chilli-ramen',
    name: 'Chilli Crisp Ramen',
    description: 'Silky noodles, roasted corn, chilli crisp',
    price: 275,
    image: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=650',
    tag: 'Big flavour',
  },
];

const locations = ['Koramangala', 'Indiranagar', 'Bandra West'];

function SectionHeading({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[28px] leading-none text-foreground">{title}</h2>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="press flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-accent transition-colors hover:bg-accent/10"
          data-testid={`button-${action.toLowerCase().replaceAll(' ', '-')}`}
        >
          {action}
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function RestaurantRail({ onViewAll }: { onViewAll: () => void }) {
  return (
    <section id="restaurants" className="scroll-mt-6">
      <SectionHeading eyebrow="Curated close by" title="Our Restaurants" action="See all" onAction={onViewAll} />
      <div className="hide-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0">
        {restaurants.map((restaurant, index) => (
          <button
            type="button"
            key={restaurant.id}
            className="press group flex w-[94px] shrink-0 snap-start flex-col items-center text-center"
            data-testid={`button-restaurant-${restaurant.id}`}
          >
            <span
              className={`mb-3 block h-[84px] w-[84px] overflow-hidden rounded-full border-[3px] border-card ${restaurant.tone} p-1 shadow-[0_8px_20px_hsl(276_31%_28%/.12)] transition-transform duration-300 group-hover:-translate-y-1`}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full rounded-full object-cover"
                data-testid={`img-restaurant-${restaurant.id}`}
              />
            </span>
            <span className="line-clamp-2 text-[12px] font-bold leading-[1.2] text-foreground">{restaurant.name}</span>
            <span className="mt-1 text-[10px] font-medium text-muted-foreground">{restaurant.cuisine}</span>
            {index === 0 && <span className="mt-2 rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-secondary-foreground">Top pick</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function FoodCard({
  item,
  quantity,
  onAdd,
}: {
  item: FoodItem;
  quantity: number;
  onAdd: (item: FoodItem) => void;
}) {
  return (
    <article className="lift group overflow-hidden rounded-[22px] border border-card-border bg-card shadow-[0_7px_22px_hsl(276_31%_28%/.06)]" data-testid={`card-food-${item.id}`}>
      <div className="relative aspect-[1.18] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          data-testid={`img-food-${item.id}`}
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-bold text-accent backdrop-blur-sm">
          {item.tag}
        </span>
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[18px] leading-[1.05] text-foreground">{item.name}</h3>
          <span className="shrink-0 pt-0.5 text-[13px] font-bold text-accent">₹{item.price}</span>
        </div>
        <p className="mt-1.5 min-h-[32px] text-[11px] leading-[1.45] text-muted-foreground">{item.description}</p>
        <button
          type="button"
          onClick={() => onAdd(item)}
          className={`press mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all ${
            quantity > 0 ? 'bg-[#537b67] text-[#fdf8ef]' : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          data-testid={`button-add-${item.id}`}
          aria-label={`Add ${item.name} to cart`}
        >
          {quantity > 0 ? (
            <>
              <Check size={14} strokeWidth={3} />
              Added{quantity > 1 ? ` · ${quantity}` : ''}
            </>
          ) : (
            <>
              <Plus size={15} strokeWidth={2.75} />
              Add
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function FoodSection({
  id,
  title,
  eyebrow,
  icon,
  items,
  cart,
  onAdd,
}: {
  id: string;
  title: string;
  eyebrow: string;
  icon: ReactNode;
  items: FoodItem[];
  cart: Record<string, number>;
  onAdd: (item: FoodItem) => void;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-5">
        {items.map((item) => (
          <FoodCard key={item.id} item={item} quantity={cart[item.id] ?? 0} onAdd={onAdd} />
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-secondary/45 px-4 py-3 text-[11px] font-medium text-secondary-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">{icon}</span>
        <span>{title === 'Healthy Food' ? 'Good food should leave you feeling good.' : 'A little heat makes a good story.'}</span>
      </div>
    </section>
  );
}

function BottomNav({
  active,
  cartCount,
  onNavigate,
}: {
  active: string;
  cartCount: number;
  onNavigate: (item: string) => void;
}) {
  const items = [
    { id: 'home', label: 'Home', icon: HomeIcon, target: 'top' },
    { id: 'restaurants', label: 'Restaurants', icon: Store, target: 'restaurants' },
    { id: 'orders', label: 'Orders', icon: ClipboardList, target: undefined },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, target: undefined },
    { id: 'account', label: 'Account', icon: UserRound, target: undefined },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-2 pb-[max(9px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_hsl(276_31%_28%/.08)] backdrop-blur-xl md:bottom-5 md:left-1/2 md:max-w-[600px] md:-translate-x-1/2 md:rounded-[24px] md:border md:px-4 md:pb-3">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`press relative flex min-w-[54px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid={`button-nav-${item.id}`}
            >
              <span className={`relative flex h-6 items-center justify-center rounded-full px-2 transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2.7 : 2} />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] text-accent-foreground" data-testid="status-cart-count">
                    {cartCount}
                  </span>
                )}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="footer-link inline-flex w-fit items-center text-[12px] font-medium text-[#e7dbe5] transition-colors hover:text-secondary"
    >
      {children}
    </a>
  );
}

function SiteFooter() {
  return (
    <footer
      id="information"
      className="mt-11 overflow-hidden rounded-[28px] bg-accent text-accent-foreground shadow-[0_20px_45px_hsl(276_31%_28%/.16)]"
      aria-label="Central Kitchen information"
    >
      <div className="px-5 pb-7 pt-7 md:px-9 md:pb-9 md:pt-9">
        <div className="flex flex-col gap-4 border-b border-[#8a6b8d]/50 pb-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              <Utensils size={13} /> The Central Kitchen promise
            </p>
            <h2 className="font-display text-[29px] leading-[1.02] tracking-[-0.03em] text-[#fff9ee]">
              Good food, thoughtfully delivered.
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#ded1d7]">
              A neighbourhood-first food guide for meals worth making room for.
            </p>
          </div>
          <a
            href="#top"
            className="press flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground"
          >
            Back to top <ArrowRight size={14} className="-rotate-90" />
          </a>
        </div>

        <div className="grid gap-7 border-b border-[#8a6b8d]/50 py-7 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 text-secondary">
              <Star size={15} fill="currentColor" />
              <h3 className="text-sm font-bold text-[#fff9ee]">About Central Kitchen</h3>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-[#ded1d7]">
              We bring together independent restaurants, bright flavours, and reliable doorstep delivery in one friendly place.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-secondary">
              <Timer size={15} />
              <h3 className="text-sm font-bold text-[#fff9ee]">Timings</h3>
            </div>
            <p className="text-[12px] leading-relaxed text-[#ded1d7]">
              Open daily<br />
              10:00 AM – 11:30 PM
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-secondary">
              <Info size={15} />
              <h3 className="text-sm font-bold text-[#fff9ee]">Important Information</h3>
            </div>
            <p className="text-[12px] leading-relaxed text-[#ded1d7]">
              Menu availability, ingredients, taxes, and estimated times may vary by restaurant and location.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-secondary">
              <ShieldCheck size={15} />
              <h3 className="text-sm font-bold text-[#fff9ee]">Help &amp; Support</h3>
            </div>
            <p className="text-[12px] leading-relaxed text-[#ded1d7]">
              Need a hand with an order? Reach us through phone, WhatsApp, or email and we&apos;ll help make it right.
            </p>
          </div>
        </div>

        <div id="contact" className="grid gap-3 border-b border-[#8a6b8d]/50 py-6 sm:grid-cols-2">
          <a
            href="tel:+919876543210"
            className="press flex items-center gap-3 rounded-2xl border border-[#8a6b8d]/50 bg-[#4a3155]/45 px-4 py-3 transition-colors hover:bg-[#5b3e67]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Phone size={16} />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#bfaebe]">Contact Us</span>
              <span className="mt-0.5 block text-xs font-bold text-[#fff9ee]">Phone / WhatsApp · +91 98765 43210</span>
            </span>
          </a>
          <a
            href="mailto:hello@centralkitchen.in"
            className="press flex items-center gap-3 rounded-2xl border border-[#8a6b8d]/50 bg-[#4a3155]/45 px-4 py-3 transition-colors hover:bg-[#5b3e67]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Mail size={16} />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#bfaebe]">Email</span>
              <span className="mt-0.5 block text-xs font-bold text-[#fff9ee]">hello@centralkitchen.in</span>
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <FooterLink href="#information">Terms &amp; Conditions</FooterLink>
            <FooterLink href="#information">Privacy Policy</FooterLink>
            <FooterLink href="#information">Refund &amp; Cancellation Policy</FooterLink>
          </div>
          <div className="flex items-center gap-2" aria-label="Social Media links">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#bfaebe]">Social</span>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Central Kitchen on Instagram"
              className="press flex h-8 w-8 items-center justify-center rounded-full border border-[#8a6b8d]/60 text-[#fff9ee] transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Central Kitchen on Facebook"
              className="press flex h-8 w-8 items-center justify-center rounded-full border border-[#8a6b8d]/60 text-[#fff9ee] transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              aria-label="Central Kitchen on WhatsApp"
              className="press flex h-8 w-8 items-center justify-center rounded-full border border-[#8a6b8d]/60 text-[#fff9ee] transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        <p className="mt-6 text-[10px] font-medium tracking-wide text-[#bfaebe]">
          Copyright © Central Kitchen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Home() {
  const [location, setLocation] = useState('Koramangala');
  const [locationOpen, setLocationOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState('');

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);

  const addToCart = (item: FoodItem) => {
    setCart((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
    setNotice(`${item.name} added to your cart`);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const navigate = (item: string) => {
    setActiveNav(item);
    const target = item === 'home' ? 'top' : item === 'restaurants' ? 'restaurants' : item === 'cart' ? 'healthy-food' : undefined;
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setNotice(item === 'orders' ? 'Your next order will appear here.' : 'Account settings are coming with your first order.');
      window.setTimeout(() => setNotice(''), 2200);
    }
  };

  return (
    <div className="grain app-shell min-h-[100dvh]">
      <div id="top" className="mx-auto max-w-6xl px-5 pb-8 pt-5 md:px-10 md:pt-8 lg:px-14 nav-safe">
        <header className="appear-up flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 rotate-[-8deg] items-center justify-center rounded-[11px] bg-accent text-secondary shadow-[4px_4px_0_hsl(47_93%_64%/.55)]">
                <span className="font-display text-xl leading-none">C</span>
              </span>
              <span className="font-display text-[25px] tracking-[-0.04em] text-accent">Central Kitchen</span>
            </div>
            <p className="mt-2 pl-10 text-[11px] font-medium tracking-wide text-muted-foreground">The good stuff, close to home.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('cart')}
            className="press relative mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-accent shadow-sm"
            data-testid="button-header-cart"
            aria-label={`View cart with ${cartCount} items`}
          >
            <ShoppingBag size={20} strokeWidth={2.1} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground pop">{cartCount}</span>}
          </button>
        </header>

        <main className="mt-7 space-y-11">
          <section className="appear-up-2 relative">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Delivering to</p>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#537b67]">
                <Clock3 size={12} /> 25–35 min
              </span>
            </div>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setLocationOpen((open) => !open)}
                className="press flex items-center gap-2 rounded-xl py-1 text-left text-[16px] font-bold text-foreground"
                data-testid="button-location-picker"
                aria-expanded={locationOpen}
              >
                <MapPin size={17} className="text-primary" fill="currentColor" />
                {location}
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationOpen && (
                <div className="absolute left-0 top-11 z-10 w-56 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_18px_45px_hsl(276_31%_28%/.18)]" data-testid="popover-location-picker">
                  <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Choose your neighbourhood</p>
                  {locations.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        setLocation(option);
                        setLocationOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-muted"
                      data-testid={`button-location-${option.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      {option}
                      {location === option && <Check size={15} className="text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="appear-up-3 overflow-hidden rounded-[28px] bg-accent p-6 text-accent-foreground shadow-[0_20px_45px_hsl(276_31%_28%/.2)] md:p-8">
            <div className="relative z-[1] flex min-h-[206px] flex-col justify-between">
              <div className="max-w-[220px]">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                  <Sparkles size={14} /> Central Kitchen presents
                </div>
                <h1 className="font-display text-[39px] leading-[.96] tracking-[-0.04em] text-[#fff9ee] md:text-5xl">
                  Special food.<br />
                  <span className="text-secondary">No small talk.</span>
                </h1>
                <p className="mt-3 max-w-[190px] text-xs leading-relaxed text-[#ded1d7]">A rotating plate of the neighbourhood&apos;s most wanted bites.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotice('Special picks are waiting below');
                  document.getElementById('healthy-food')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="press mt-5 flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground"
                data-testid="button-explore-special"
              >
                Explore today&apos;s special <ArrowRight size={15} />
              </button>
            </div>
            <div className="pointer-events-none absolute -right-9 -top-9 h-48 w-48 rounded-full border-[22px] border-primary/70 md:right-12 md:top-[-70px] md:h-64 md:w-64 md:border-[32px]" />
            <div className="pointer-events-none absolute -bottom-16 right-[-20px] h-48 w-48 rounded-full bg-primary/85 blur-[1px] md:right-[16%]" />
            <div className="pointer-events-none absolute bottom-7 right-8 h-[108px] w-[108px] rotate-12 overflow-hidden rounded-full border-4 border-secondary shadow-xl md:right-24 md:h-[140px] md:w-[140px]">
              <img
                src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="A special plate from Central Kitchen"
                className="h-full w-full object-cover"
                data-testid="img-special-food"
              />
            </div>
          </section>

          <RestaurantRail onViewAll={() => {
            setNotice('You are already seeing the neighbourhood shortlist.');
            window.setTimeout(() => setNotice(''), 2200);
          }} />

          <FoodSection
            id="healthy-food"
            eyebrow="Feel-good favourites"
            title="Healthy Food"
            icon={<Leaf size={13} />}
            items={healthyFood}
            cart={cart}
            onAdd={addToCart}
          />

          <FoodSection
            id="spicy-food"
            eyebrow="For the brave"
            title="Spicy Food"
            icon={<Flame size={13} />}
            items={spicyFood}
            cart={cart}
            onAdd={addToCart}
          />

          <section className="rounded-[24px] border border-border bg-card/65 px-5 py-7 text-center">
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Star size={16} fill="currentColor" />
            </div>
            <h2 className="font-display text-2xl text-accent">Made for your cravings.</h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">New neighbourhood favourites land here every week. Keep exploring.</p>
          </section>

          <SiteFooter />
        </main>
      </div>

      {notice && (
        <div className="fixed bottom-[86px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-3 text-xs font-bold text-accent-foreground shadow-[0_12px_32px_hsl(276_31%_28%/.25)] appear-up" role="status" aria-live="polite" data-testid="status-feedback">
          <Check size={14} className="text-secondary" strokeWidth={3} />
          {notice}
          <button type="button" className="ml-1 rounded-full p-0.5 hover:bg-card/10" onClick={() => setNotice('')} data-testid="button-dismiss-feedback" aria-label="Dismiss message">
            <X size={13} />
          </button>
        </div>
      )}

      <BottomNav active={activeNav} cartCount={cartCount} onNavigate={navigate} />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;