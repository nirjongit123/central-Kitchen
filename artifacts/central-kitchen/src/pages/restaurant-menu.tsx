import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Menu as MenuIcon,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useLocation } from 'wouter';
import type { MenuCategory, MenuDiet, MenuItem } from '@/data/spicyWicyMenu';

type RestaurantMenuPageProps = {
  restaurant: {
    name: string;
    location: string;
    deliveryTime: string;
    offers: string[];
  };
  items: MenuItem[];
  categories: MenuCategory[];
};

type DietFilter = MenuDiet | 'all';
type Cart = Record<string, number>;
type OrderStatus = 'placed' | 'preparing' | 'out-for-delivery' | 'delivered';

type CustomerOrder = {
  id: string;
  items: Cart;
  subtotal: number;
  status: OrderStatus;
  rating?: number;
  review?: string;
};

const orderStorageKey = 'central-kitchen-spicy-wicy-order';

const orderStatusDetails: Record<OrderStatus, { label: string; description: string }> = {
  placed: { label: 'Order placed', description: 'Your order has been sent to the kitchen.' },
  preparing: { label: 'Being prepared', description: 'The kitchen is preparing your order now.' },
  'out-for-delivery': { label: 'Out for delivery', description: 'Your order is on its way to you.' },
  delivered: { label: 'Delivered', description: 'Enjoy your Spicy Wicy - Dicey order.' },
};

const orderStatusSequence: OrderStatus[] = ['placed', 'preparing', 'out-for-delivery', 'delivered'];

const dietLabels: Record<MenuDiet, string> = {
  veg: 'Veg',
  egg: 'Egg',
  'non-veg': 'Non-Veg',
};

const dietColors: Record<MenuDiet, string> = {
  veg: 'border-[#4e8c5b] text-[#367142]',
  egg: 'border-[#c68a2a] text-[#a56812]',
  'non-veg': 'border-[#d45c4c] text-[#b34135]',
};

function DietMark({ diet }: { diet: MenuDiet }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] ${dietColors[diet]}`}>
      <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border ${dietColors[diet]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {dietLabels[diet]}
    </span>
  );
}

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onChangeQuantity,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onChangeQuantity: (delta: number) => void;
}) {
  return (
    <article className="lift flex gap-3 rounded-[22px] border border-card-border bg-card p-3 shadow-[0_7px_22px_hsl(276_31%_28%/.06)]" data-testid={`card-menu-item-${item.id}`}>
      <div className="relative h-[102px] w-[102px] shrink-0 overflow-hidden rounded-[16px] bg-muted">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-2 top-2 rounded-full bg-card/90 px-2 py-1 text-[9px] font-bold text-accent backdrop-blur-sm">
          {dietLabels[item.dietary]}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[18px] leading-[1.05] text-foreground">{item.name}</h3>
            <span className="shrink-0 text-[13px] font-bold text-accent">₹{item.price}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <DietMark diet={item.dietary} />
            {item.customisable && (
              <span className="rounded-full bg-secondary/65 px-2 py-0.5 text-[9px] font-bold text-secondary-foreground">
                Customisable
              </span>
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.35] text-muted-foreground">{item.description}</p>
        </div>
        <div className="mt-2 flex justify-end">
          {quantity > 0 ? (
            <div className="flex h-8 items-center gap-3 rounded-xl bg-primary px-2 text-primary-foreground" data-testid={`control-quantity-${item.id}`}>
              <button type="button" onClick={() => onChangeQuantity(-1)} className="press flex h-6 w-6 items-center justify-center rounded-lg" aria-label={`Decrease ${item.name}`}>
                <Minus size={13} strokeWidth={3} />
              </button>
              <span className="min-w-3 text-center text-xs font-bold">{quantity}</span>
              <button type="button" onClick={() => onChangeQuantity(1)} className="press flex h-6 w-6 items-center justify-center rounded-lg" aria-label={`Increase ${item.name}`}>
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="press flex h-8 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
              data-testid={`button-menu-add-${item.id}`}
            >
              <Plus size={14} strokeWidth={2.75} /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CartSheet({
  open,
  items,
  cart,
  total,
  onClose,
  onChangeQuantity,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  items: MenuItem[];
  cart: Cart;
  total: number;
  onClose: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-accent/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Your cart">
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close cart" />
      <aside className="absolute inset-x-0 bottom-0 max-h-[78dvh] overflow-y-auto rounded-t-[28px] bg-card p-5 shadow-[0_-18px_55px_hsl(276_31%_28%/.22)] md:bottom-5 md:left-1/2 md:max-w-[520px] md:-translate-x-1/2 md:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Spicy Wicy - Dicey</p>
            <h2 className="mt-1 font-display text-2xl text-accent">Your cart</h2>
          </div>
          <button type="button" onClick={onClose} className="press flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground" aria-label="Close cart">
            <X size={17} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-muted/70 px-4 py-8 text-center">
            <ShoppingBag className="mx-auto text-muted-foreground" size={24} />
            <p className="mt-3 text-sm font-bold text-foreground">Your cart is empty</p>
            <p className="mt-1 text-xs text-muted-foreground">Add something you are craving to get started.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-border px-3 py-3">
                  <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-foreground">{item.name}</p>
                    <p className="mt-1 text-xs font-semibold text-accent">₹{item.price * (cart[item.id] ?? 0)}</p>
                  </div>
                  <div className="flex h-8 items-center gap-2 rounded-xl bg-muted px-1.5">
                    <button type="button" onClick={() => onChangeQuantity(item.id, -1)} className="press flex h-6 w-6 items-center justify-center rounded-lg" aria-label={`Decrease ${item.name}`}>
                      <Minus size={12} />
                    </button>
                    <span className="min-w-3 text-center text-xs font-bold">{cart[item.id]}</span>
                    <button type="button" onClick={() => onChangeQuantity(item.id, 1)} className="press flex h-6 w-6 items-center justify-center rounded-lg" aria-label={`Increase ${item.name}`}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button type="button" onClick={() => onRemove(item.id)} className="press p-1 text-muted-foreground hover:text-destructive" aria-label={`Remove ${item.name}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-semibold text-muted-foreground">Total amount</span>
              <span className="font-display text-2xl text-accent">₹{total}</span>
            </div>
            <button type="button" onClick={onCheckout} className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
              Continue to checkout <ChevronRight size={17} />
            </button>
          </>
        )}
      </aside>
    </div>
  );
}

function CategorySheet({
  open,
  categories,
  onClose,
  onSelect,
}: {
  open: boolean;
  categories: MenuCategory[];
  onClose: () => void;
  onSelect: (category: MenuCategory) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-accent/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Spicy Wicy - Dicey menu categories">
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close menu" />
      <aside className="absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto rounded-t-[28px] bg-card p-5 shadow-[0_-18px_55px_hsl(276_31%_28%/.22)] md:bottom-5 md:left-1/2 md:max-w-[520px] md:-translate-x-1/2 md:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Browse by category</p>
            <h2 className="mt-1 font-display text-2xl text-accent">Spicy Wicy - Dicey menu</h2>
          </div>
          <button type="button" onClick={onClose} className="press flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground" aria-label="Close menu">
            <X size={17} />
          </button>
        </div>
        <div className="grid gap-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => onSelect(category)}
              className="press flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
              data-testid={`button-menu-category-${category.id}`}
            >
              <span className="text-sm font-bold text-foreground">{category.title}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function CheckoutSheet({
  open,
  items,
  cart,
  subtotal,
  onClose,
  onPlaceOrder,
}: {
  open: boolean;
  items: MenuItem[];
  cart: Cart;
  subtotal: number;
  onClose: () => void;
  onPlaceOrder: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] bg-accent/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Checkout">
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close checkout" />
      <aside className="absolute inset-x-0 bottom-0 max-h-[84dvh] overflow-y-auto rounded-t-[28px] bg-card p-5 shadow-[0_-18px_55px_hsl(276_31%_28%/.22)] md:bottom-5 md:left-1/2 md:max-w-[520px] md:-translate-x-1/2 md:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Spicy Wicy - Dicey</p>
            <h2 className="mt-1 font-display text-2xl text-accent">Checkout</h2>
          </div>
          <button type="button" onClick={onClose} className="press flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground" aria-label="Close checkout">
            <X size={17} />
          </button>
        </div>

        <div className="rounded-2xl bg-secondary/45 px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Deliver to</p>
          <p className="mt-1 text-sm font-bold text-foreground">Koramangala</p>
          <p className="mt-1 text-xs text-muted-foreground">Estimated delivery · 25–35 min</p>
        </div>

        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
              <p className="min-w-0 truncate text-xs font-bold text-foreground">
                {cart[item.id]} × {item.name}
              </p>
              <span className="shrink-0 text-xs font-bold text-accent">₹{item.price * (cart[item.id] ?? 0)}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs font-semibold text-muted-foreground">Subtotal</span>
          <span className="font-display text-2xl text-accent">₹{subtotal}</span>
        </div>
        <button type="button" onClick={onPlaceOrder} className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
          Place order <ChevronRight size={17} />
        </button>
      </aside>
    </div>
  );
}

function OrderFlowSheet({
  open,
  phase,
  order,
  items,
  onClose,
  onTrack,
  onAdvance,
  onSaveRating,
}: {
  open: boolean;
  phase: 'confirmation' | 'tracking';
  order: CustomerOrder | null;
  items: MenuItem[];
  onClose: () => void;
  onTrack: () => void;
  onAdvance: () => void;
  onSaveRating: (rating: number, review: string) => void;
}) {
  const [rating, setRating] = useState(order?.rating ?? 0);
  const [review, setReview] = useState(order?.review ?? '');

  useEffect(() => {
    setRating(order?.rating ?? 0);
    setReview(order?.review ?? '');
  }, [order?.id, order?.rating, order?.review]);

  if (!open || !order) return null;

  const statusIndex = orderStatusSequence.indexOf(order.status);
  const orderItems = items.filter((item) => (order.items[item.id] ?? 0) > 0);
  const isDelivered = order.status === 'delivered';

  return (
    <div className="fixed inset-0 z-[75] bg-accent/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={phase === 'confirmation' ? 'Order confirmation' : 'Order tracking'}>
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close order details" />
      <aside className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[28px] bg-card p-5 shadow-[0_-18px_55px_hsl(276_31%_28%/.22)] md:bottom-5 md:left-1/2 md:max-w-[560px] md:-translate-x-1/2 md:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Order #{order.id}</p>
            <h2 className="mt-1 font-display text-2xl text-accent">{phase === 'confirmation' ? 'Order confirmed' : 'Order tracking'}</h2>
          </div>
          <button type="button" onClick={onClose} className="press flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground" aria-label="Close order details">
            <X size={17} />
          </button>
        </div>

        {phase === 'confirmation' ? (
          <>
            <div className="rounded-[24px] bg-secondary/55 px-5 py-7 text-center">
              <CheckCircle2 className="mx-auto text-[#537b67]" size={38} />
              <p className="mt-3 text-sm font-bold text-foreground">Thanks, your order is on its way to the kitchen.</p>
              <p className="mt-1 text-xs text-muted-foreground">Estimated delivery · 25–35 min</p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border px-4 py-3">
              <span className="text-xs font-semibold text-muted-foreground">{Object.values(order.items).reduce((sum, quantity) => sum + quantity, 0)} items</span>
              <span className="font-display text-2xl text-accent">₹{order.subtotal}</span>
            </div>
            <button type="button" onClick={onTrack} className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
              Track order <Truck size={17} />
            </button>
          </>
        ) : (
          <>
            <div className="rounded-[24px] border border-border bg-background px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                  {isDelivered ? <PackageCheck size={20} /> : <Truck size={20} />}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{orderStatusDetails[order.status].label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{orderStatusDetails[order.status].description}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {orderStatusSequence.map((status, index) => {
                  const complete = index <= statusIndex;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${complete ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}>
                        {complete ? <Check size={13} strokeWidth={3} /> : index + 1}
                      </span>
                      <span className={`text-xs font-semibold ${complete ? 'text-foreground' : 'text-muted-foreground'}`}>{orderStatusDetails[status].label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {!isDelivered && (
              <button type="button" onClick={onAdvance} className="press mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                {order.status === 'placed' ? 'Start preparing order' : order.status === 'preparing' ? 'Mark out for delivery' : 'Mark as delivered'}
                <ChevronRight size={17} />
              </button>
            )}

            {isDelivered && !order.rating && (
              <div className="mt-4 rounded-[24px] bg-secondary/45 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Delivered just now</p>
                <h3 className="mt-2 font-display text-2xl text-accent">How was your order?</h3>
                <p className="mt-1 text-sm font-semibold text-foreground">Rate Spicy Wicy - Dicey</p>
                <div className="mt-4 flex gap-2" role="group" aria-label="Rate your order from one to five stars">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      className={`press flex h-10 w-10 items-center justify-center rounded-full border ${rating >= value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}
                      aria-label={`${value} star${value === 1 ? '' : 's'}`}
                      aria-pressed={rating === value}
                    >
                      <Star size={17} fill={rating >= value ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={review}
                  onChange={(event) => setReview(event.target.value)}
                  placeholder="Add an optional review"
                  className="mt-4 min-h-20 w-full resize-none rounded-2xl border border-border bg-card px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  aria-label="Optional review"
                />
                <button type="button" disabled={!rating} onClick={() => onSaveRating(rating, review)} className="press mt-3 flex h-11 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                  Save rating
                </button>
              </div>
            )}

            {isDelivered && order.rating && (
              <div className="mt-4 rounded-[24px] bg-secondary/45 px-5 py-5 text-center">
                <div className="flex justify-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((value) => <Star key={value} size={18} fill={value <= order.rating! ? 'currentColor' : 'none'} />)}
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">Thanks for rating your order.</p>
                {order.review && <p className="mt-1 text-xs text-muted-foreground">“{order.review}”</p>}
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-border px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Order summary</p>
              <div className="mt-2 space-y-1.5">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-xs">
                    <span className="truncate text-muted-foreground">{order.items[item.id]} × {item.name}</span>
                    <span className="shrink-0 font-semibold text-accent">₹{item.price * order.items[item.id]}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default function RestaurantMenuPage({ restaurant, items, categories }: RestaurantMenuPageProps) {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<Cart>({});
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState<CustomerOrder | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedOrder = window.localStorage.getItem(orderStorageKey);
      return savedOrder ? (JSON.parse(savedOrder) as CustomerOrder) : null;
    } catch {
      return null;
    }
  });
  const [orderView, setOrderView] = useState<'confirmation' | 'tracking' | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (order) {
      window.localStorage.setItem(orderStorageKey, JSON.stringify(order));
    } else {
      window.localStorage.removeItem(orderStorageKey);
    }
  }, [order]);

  const itemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const cartItems = useMemo(() => items.filter((item) => (cart[item.id] ?? 0) > 0), [cart, items]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);
  const normalizedQuery = query.trim().toLowerCase();

  const visibleCategories = categories
    .map((category) => ({
      category,
      items: category.itemIds
        .map((id) => itemById.get(id))
        .filter((item): item is MenuItem => Boolean(item))
        .filter((item) => dietFilter === 'all' || item.dietary === dietFilter)
        .filter((item) => !normalizedQuery || `${item.name} ${item.description}`.toLowerCase().includes(normalizedQuery)),
    }))
    .filter(({ items: categoryItems }) => categoryItems.length > 0);

  const setQuantity = (id: string, delta: number) => {
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: nextQuantity };
    });
  };

  const addItem = (item: MenuItem) => {
    setQuantity(item.id, 1);
    setNotice(`${item.name} added to cart`);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const selectCategory = (category: MenuCategory) => {
    setMenuOpen(false);
    setQuery('');
    setDietFilter('all');
    setActiveCategoryId(category.id);
    window.setTimeout(() => document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const selectAllCategories = () => {
    setQuery('');
    setDietFilter('all');
    setActiveCategoryId('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = () => {
    if (!cartCount) return;
    const nextOrder: CustomerOrder = {
      id: `${Date.now()}`.slice(-6),
      items: { ...cart },
      subtotal: cartTotal,
      status: 'placed',
    };
    setOrder(nextOrder);
    setCart({});
    setCheckoutOpen(false);
    setCartOpen(false);
    setOrderView('confirmation');
  };

  const advanceOrder = () => {
    setOrder((current) => {
      if (!current) return current;
      const currentIndex = orderStatusSequence.indexOf(current.status);
      const nextStatus = orderStatusSequence[Math.min(currentIndex + 1, orderStatusSequence.length - 1)];
      return { ...current, status: nextStatus };
    });
  };

  const saveRating = (rating: number, review: string) => {
    setOrder((current) => (current ? { ...current, rating, review: review.trim() } : current));
    setNotice('Thanks for rating your order');
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <div className="grain app-shell min-h-[100dvh] pb-32">
      <div className="mx-auto max-w-5xl px-5 pb-10 pt-5 md:px-10 md:pt-8 lg:px-14">
        <header className="sticky top-0 z-30 -mx-5 border-b border-border/70 bg-background/92 px-5 pb-4 pt-5 backdrop-blur-xl md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setLocation('/')} className="press flex items-center gap-2 rounded-full px-1 py-1 text-sm font-bold text-accent" data-testid="button-back-home">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <ArrowLeft size={17} />
              </span>
              Back
            </button>
            <span className="font-display text-[22px] tracking-[-0.04em] text-accent">Central Kitchen</span>
            <button type="button" onClick={() => setCartOpen(true)} className="press relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-accent shadow-sm" aria-label={`Open cart with ${cartCount} items`}>
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
            </button>
          </div>

          <div className="mt-6 rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_35px_hsl(276_31%_28%/.07)] md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Restaurant menu</p>
                <h1 className="font-display text-[34px] leading-[.98] tracking-[-0.04em] text-accent md:text-5xl">{restaurant.name}</h1>
                <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground">
                  Made-to-order comfort food, playful Maggi, loaded buns, and bright drinks from your neighbourhood kitchen.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 md:min-w-[250px]">
                <div className="rounded-2xl bg-secondary/55 px-3 py-3 text-center">
                  <Clock3 size={15} className="mx-auto text-accent" />
                  <p className="mt-1 text-sm font-bold text-accent">{restaurant.deliveryTime}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Delivery</p>
                </div>
                <div className="rounded-2xl bg-secondary/55 px-3 py-3 text-center">
                  <MapPin size={15} className="mx-auto text-accent" />
                  <p className="mt-1 truncate text-sm font-bold text-accent">2.1 km</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Location</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <MapPin size={14} className="shrink-0 text-primary" />
              {restaurant.location}
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {restaurant.offers.map((offer) => (
                <span key={offer} className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-[10px] font-bold text-foreground">
                  <Tag size={12} className="text-primary" /> {offer}
                </span>
              ))}
            </div>

            <label className="mt-5 flex h-12 items-center gap-3 rounded-2xl border border-border bg-background px-4 text-muted-foreground">
              <Search size={17} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search in Spicy Wicy - Dicey"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search in Spicy Wicy - Dicey"
                data-testid="input-search-menu"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear menu search">
                  <X size={15} />
                </button>
              )}
            </label>
          </div>
        </header>

        {order && (
          <button
            type="button"
            onClick={() => setOrderView('tracking')}
            className="press mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-[0_7px_22px_hsl(276_31%_28%/.05)]"
            data-testid="button-order-status"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                {order.status === 'delivered' ? <PackageCheck size={17} /> : <Truck size={17} />}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-foreground">{orderStatusDetails[order.status].label}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{orderStatusDetails[order.status].description}</span>
              </span>
            </span>
            <span className="shrink-0 text-xs font-bold text-primary">
              {order.status === 'delivered' && !order.rating ? 'Rate your order' : 'Track order'}
              <ChevronRight size={15} className="ml-1 inline" />
            </span>
          </button>
        )}

        <main className="mt-7">
          <div className="sticky top-[78px] z-20 -mx-5 mb-8 bg-background/92 px-5 py-2 backdrop-blur-xl md:static md:mx-0 md:bg-transparent md:px-0 md:py-0">
            <div className="flex gap-2 overflow-x-auto">
              {(['all', 'veg', 'egg', 'non-veg'] as DietFilter[]).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setDietFilter(filter)}
                  className={`press shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                    dietFilter === filter ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`button-filter-${filter}`}
                >
                  {filter === 'all' ? 'All' : dietLabels[filter]}
                </button>
              ))}
            </div>
            <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto border-t border-border/70 pt-2" data-testid="category-navigation">
              <button
                type="button"
                onClick={selectAllCategories}
                className={`press shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${activeCategoryId === 'all' ? 'bg-secondary text-secondary-foreground' : 'bg-card text-muted-foreground'}`}
                data-testid="button-category-all"
              >
                All categories
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => selectCategory(category)}
                  className={`press shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${activeCategoryId === category.id ? 'bg-secondary text-secondary-foreground' : 'bg-card text-muted-foreground'}`}
                  data-testid={`button-category-nav-${category.id}`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {visibleCategories.map(({ category, items: categoryItems }) => (
              <section key={category.id} id={`category-${category.id}`} className="scroll-mt-36" data-testid={`section-category-${category.id}`}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      {category.id === 'recommended' ? 'Picked for your first order' : `${categoryItems.length} items`}
                    </p>
                    <h2 className="font-display text-[27px] leading-none text-foreground">{category.title}</h2>
                  </div>
                  <span className="hidden text-xs font-semibold text-muted-foreground sm:block">Spicy Wicy - Dicey</span>
                </div>
                <div className="grid gap-3.5">
                  {categoryItems.map((item) => (
                    <MenuItemCard
                      key={`${category.id}-${item.id}`}
                      item={item}
                      quantity={cart[item.id] ?? 0}
                      onAdd={() => addItem(item)}
                      onChangeQuantity={(delta) => setQuantity(item.id, delta)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {visibleCategories.length === 0 && (
            <div className="rounded-[24px] border border-border bg-card px-5 py-12 text-center">
              <Search className="mx-auto text-muted-foreground" size={24} />
              <h2 className="mt-3 font-display text-2xl text-accent">No menu items found</h2>
              <p className="mt-2 text-xs text-muted-foreground">Try a different search or filter.</p>
            </div>
          )}
        </main>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className={`press fixed right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-xs font-bold text-accent-foreground shadow-[0_12px_32px_hsl(276_31%_28%/.25)] ${cartCount > 0 ? 'bottom-[88px]' : 'bottom-24'}`}
        data-testid="button-floating-menu"
      >
        <MenuIcon size={17} /> Menu
      </button>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-5 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_35px_hsl(276_31%_28%/.12)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-foreground">{cartCount} item{cartCount === 1 ? '' : 's'} in cart</p>
              <p className="mt-0.5 text-sm font-bold text-accent">₹{cartTotal}</p>
            </div>
            <button type="button" onClick={() => setCartOpen(true)} className="press flex h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground">
              View cart <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-[86px] left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-3 text-xs font-bold text-accent-foreground shadow-[0_12px_32px_hsl(276_31%_28%/.25)] appear-up" role="status" aria-live="polite" data-testid="status-menu-feedback">
          <Check size={14} className="text-secondary" strokeWidth={3} />
          {notice}
          <button type="button" className="ml-1 rounded-full p-0.5 hover:bg-card/10" onClick={() => setNotice('')} aria-label="Dismiss message">
            <X size={13} />
          </button>
        </div>
      )}

      <CategorySheet open={menuOpen} categories={categories} onClose={() => setMenuOpen(false)} onSelect={selectCategory} />
      <CartSheet
        open={cartOpen}
        items={cartItems}
        cart={cart}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={setQuantity}
        onRemove={(id) => setQuantity(id, -(cart[id] ?? 0))}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutSheet
        open={checkoutOpen}
        items={cartItems}
        cart={cart}
        subtotal={cartTotal}
        onClose={() => setCheckoutOpen(false)}
        onPlaceOrder={placeOrder}
      />
      <OrderFlowSheet
        open={Boolean(order && orderView)}
        phase={orderView ?? 'tracking'}
        order={order}
        items={items}
        onClose={() => setOrderView(null)}
        onTrack={() => setOrderView('tracking')}
        onAdvance={advanceOrder}
        onSaveRating={saveRating}
      />
    </div>
  );
}