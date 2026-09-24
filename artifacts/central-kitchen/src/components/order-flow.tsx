import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  Home,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  Smartphone,
  Star,
  Trash2,
  Truck,
  WalletCards,
  X,
} from 'lucide-react';
import type { MenuItem } from '@/data/spicyWicyMenu';

export type OrderCart = Record<string, number>;

export type DeliveryAddress = {
  id: string;
  fullName: string;
  mobileNumber: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
};

export type OrderStatus = 'confirmed' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'on_the_way' | 'delivered';
export type PaymentMethod = 'upi' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'paid';

export type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  variations: string[];
  addons: string[];
};

export type CustomerOrder = {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  customerRating?: number;
  customerReview?: string;
  reviewDetails?: {
    foodQuality: string;
    packaging: string;
    deliveryExperience: string;
  };
};

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = ['confirmed', 'accepted', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: 'Order Confirmed',
  accepted: 'Restaurant Accepted',
  preparing: 'Food Being Prepared',
  ready: 'Food Ready',
  picked_up: 'Picked Up',
  on_the_way: 'On the Way',
  delivered: 'Delivered',
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  confirmed: 'Your order has been sent to the restaurant.',
  accepted: 'The restaurant has accepted your order.',
  preparing: 'The kitchen is preparing your food now.',
  ready: 'Your order is packed and ready for pickup.',
  picked_up: 'The delivery partner has picked up your order.',
  on_the_way: 'Your order is on the way to you.',
  delivered: 'Enjoy your Spicy Wicy - Dicey order.',
};

type SheetShellProps = {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  onBack?: () => void;
  children: ReactNode;
  ariaLabel: string;
  wide?: boolean;
};

function SheetShell({ title, eyebrow = 'Spicy Wicy - Dicey', onClose, onBack, children, ariaLabel, wide = false }: SheetShellProps) {
  return (
    <div className="fixed inset-0 z-[75] bg-accent/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label={`Close ${ariaLabel}`} />
      <aside className={`absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-card p-5 shadow-[0_-18px_55px_hsl(276_31%_28%/.22)] md:bottom-5 md:left-1/2 ${wide ? 'md:max-w-[640px]' : 'md:max-w-[540px]'} md:-translate-x-1/2 md:rounded-[28px]`}>
        <div className="mb-5 flex items-start gap-3">
          {onBack && (
            <button type="button" onClick={onBack} className="press mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground" aria-label={`Back from ${title}`}>
              <ArrowLeft size={17} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
            <h2 className="mt-1 font-display text-2xl text-accent">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground" aria-label={`Close ${title}`}>
            <X size={17} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

function MoneyRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${emphasis ? 'border-t border-border pt-3' : ''}`}>
      <span className={`text-xs ${emphasis ? 'font-bold text-foreground' : 'font-semibold text-muted-foreground'}`}>{label}</span>
      <span className={`${emphasis ? 'font-display text-2xl text-accent' : 'text-xs font-bold text-foreground'}`}>₹{value}</span>
    </div>
  );
}

function OrderTotals({
  subtotal,
  deliveryFee,
  tax,
  discount,
  total,
}: {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-background px-4 py-4">
      <MoneyRow label="Subtotal" value={subtotal} />
      <MoneyRow label="Delivery fee" value={deliveryFee} />
      <MoneyRow label="Taxes and charges" value={tax} />
      <MoneyRow label="Discount" value={-discount} />
      <MoneyRow label="TOTAL" value={total} emphasis />
    </div>
  );
}

function CartSheet({
  open,
  restaurantName,
  items,
  cart,
  subtotal,
  deliveryFee,
  tax,
  discount,
  total,
  offerApplied,
  onApplyOffer,
  onClose,
  onChangeQuantity,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  restaurantName: string;
  items: MenuItem[];
  cart: OrderCart;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  offerApplied: boolean;
  onApplyOffer: () => void;
  onClose: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  if (!open) return null;

  return (
    <SheetShell title="Your cart" eyebrow={restaurantName} onClose={onClose} ariaLabel="Your cart">
      {items.length === 0 ? (
        <div className="rounded-2xl bg-muted/70 px-4 py-8 text-center">
          <ShoppingBagIcon />
          <p className="mt-3 text-sm font-bold text-foreground">Your cart is empty</p>
          <p className="mt-1 text-xs text-muted-foreground">Add something you are craving to get started.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border px-3 py-3">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-foreground">{item.name}</p>
                    <p className="mt-1 text-xs font-semibold text-accent">₹{item.price * (cart[item.id] ?? 0)}</p>
                  </div>
                  <button type="button" onClick={() => onRemove(item.id)} className="press p-1 text-muted-foreground hover:text-destructive" aria-label={`Remove ${item.name}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-muted-foreground">
                    <p>Variation: Standard</p>
                    <p className="mt-0.5">Add-ons: None selected</p>
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
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={onApplyOffer} className={`press mt-4 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${offerApplied ? 'border-[#537b67] bg-[#edf4ed]' : 'border-border bg-secondary/35'}`} data-testid="button-apply-offer">
            <span>
              <span className="block text-xs font-bold text-foreground">{offerApplied ? '20% off applied' : 'Apply 20% off up to ₹100'}</span>
              <span className="mt-1 block text-[10px] text-muted-foreground">{offerApplied ? `You saved ₹${discount}` : 'Available offer from this restaurant'}</span>
            </span>
            {offerApplied ? <Check size={16} className="text-[#537b67]" /> : <ChevronRight size={16} className="text-muted-foreground" />}
          </button>

          <div className="mt-4">
            <OrderTotals subtotal={subtotal} deliveryFee={deliveryFee} tax={tax} discount={discount} total={total} />
          </div>
          <button type="button" onClick={onCheckout} className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground" data-testid="button-proceed-checkout">
            Proceed to Checkout <ChevronRight size={17} />
          </button>
        </>
      )}
    </SheetShell>
  );
}

function ShoppingBagIcon() {
  return <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-accent"><WalletCards size={17} /></span>;
}

const emptyAddress: Omit<DeliveryAddress, 'id'> = {
  fullName: '',
  mobileNumber: '',
  house: '',
  street: '',
  landmark: '',
  city: '',
  state: '',
  pinCode: '',
};

function AddressField({ label, value, onChange, required = true, type = 'text', placeholder, inputMode }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; placeholder?: string; inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'none' | 'decimal' }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold text-foreground">{label}{required && <span className="text-primary"> *</span>}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function AddressSheet({
  open,
  addresses,
  selectedAddressId,
  onSelect,
  onSave,
  onContinue,
  onClose,
  onBack,
}: {
  open: boolean;
  addresses: DeliveryAddress[];
  selectedAddressId: string | null;
  onSelect: (address: DeliveryAddress) => void;
  onSave: (address: DeliveryAddress) => void;
  onContinue: () => void;
  onClose: () => void;
  onBack: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<DeliveryAddress, 'id'>>(emptyAddress);

  useEffect(() => {
    if (!open) {
      setShowForm(false);
      setEditingId(null);
    }
  }, [open]);

  if (!open) return null;

  const updateDraft = (field: keyof typeof emptyAddress, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const editAddress = (address: DeliveryAddress) => {
    const { id: _id, ...addressDraft } = address;
    setDraft(addressDraft);
    setEditingId(address.id);
    setShowForm(true);
  };

  return (
    <SheetShell title="Select delivery address" onClose={onClose} onBack={onBack} ariaLabel="Select delivery address">
      {addresses.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Saved addresses</p>
          {addresses.map((address) => (
            <div key={address.id} className={`flex items-start gap-3 rounded-2xl border px-3 py-3 ${selectedAddressId === address.id ? 'border-primary bg-secondary/25' : 'border-border'}`}>
              <button type="button" onClick={() => onSelect(address)} className="flex min-w-0 flex-1 items-start gap-3 text-left" data-testid={`button-select-address-${address.id}`}>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-accent"><Home size={15} /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-foreground">{address.fullName}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{address.house}, {address.street}, {address.landmark}, {address.city}, {address.state} · {address.pinCode}</span>
                  <span className="mt-1 block text-[10px] font-semibold text-muted-foreground">{address.mobileNumber}</span>
                </span>
              </button>
              <button type="button" onClick={() => editAddress(address)} className="press rounded-full p-2 text-muted-foreground" aria-label={`Edit address for ${address.fullName}`} data-testid={`button-edit-address-${address.id}`}>
                <Edit3 size={14} />
              </button>
              {selectedAddressId === address.id && <Check size={17} className="mt-1 shrink-0 text-primary" />}
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={() => { setDraft(emptyAddress); setEditingId(null); setShowForm(true); }} className="press mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary px-4 py-3 text-xs font-bold text-primary" data-testid="button-add-new-address">
        <Plus size={15} /> Add New Address
      </button>

      {showForm && (
        <form
          className="mt-4 rounded-2xl bg-secondary/30 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            const address = { ...draft, id: editingId ?? `address-${Date.now()}` };
            onSave(address);
            onSelect(address);
            setShowForm(false);
            setEditingId(null);
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">{editingId ? 'Edit address' : 'Add new address'}</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground" aria-label="Close address form"><X size={15} /></button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <AddressField label="Full Name" value={draft.fullName} onChange={(value) => updateDraft('fullName', value)} />
            <AddressField label="Mobile Number" value={draft.mobileNumber} onChange={(value) => updateDraft('mobileNumber', value)} type="tel" />
            <AddressField label="House / Flat / Building" value={draft.house} onChange={(value) => updateDraft('house', value)} />
            <AddressField label="Street / Area" value={draft.street} onChange={(value) => updateDraft('street', value)} />
            <AddressField label="Landmark" value={draft.landmark} onChange={(value) => updateDraft('landmark', value)} required={false} />
            <AddressField label="City" value={draft.city} onChange={(value) => updateDraft('city', value)} />
            <AddressField label="State" value={draft.state} onChange={(value) => updateDraft('state', value)} />
            <AddressField label="PIN Code" value={draft.pinCode} onChange={(value) => updateDraft('pinCode', value)} inputMode="numeric" />
          </div>
          <button type="submit" className="press mt-4 flex h-11 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground" data-testid="button-save-address">
            Save Address
          </button>
        </form>
      )}

      <button type="button" disabled={!selectedAddressId} onClick={onContinue} className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45" data-testid="button-continue-payment">
        Continue to Payment <ChevronRight size={17} />
      </button>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">Choose an address for this order. We will not assume one for you.</p>
    </SheetShell>
  );
}

function PaymentSheet({
  open,
  address,
  items,
  cart,
  subtotal,
  deliveryFee,
  tax,
  discount,
  total,
  onPay,
  onClose,
  onBack,
}: {
  open: boolean;
  address: DeliveryAddress | null;
  items: MenuItem[];
  cart: OrderCart;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  onPay: (method: PaymentMethod) => void;
  onClose: () => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  if (!open || !address) return null;

  const methods: Array<{ id: PaymentMethod; label: string; description: string; icon: typeof Smartphone }> = [
    { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm and more', icon: Smartphone },
    { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard and other cards', icon: CreditCard },
    { id: 'wallet', label: 'Other supported methods', description: 'Choose a wallet at the payment gateway', icon: WalletCards },
  ];

  return (
    <SheetShell title="Payment Method" onClose={onClose} onBack={onBack} ariaLabel="Payment Method">
      <div className="rounded-2xl bg-secondary/35 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Delivery address</p>
        <p className="mt-1 text-xs font-bold text-foreground">{address.fullName} · {address.mobileNumber}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{address.house}, {address.street}, {address.city}, {address.state} · {address.pinCode}</p>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Choose payment method</p>
        <div className="mt-2 space-y-2">
          {methods.map(({ id, label, description, icon: Icon }) => (
            <button type="button" key={id} onClick={() => setMethod(id)} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${method === id ? 'border-primary bg-secondary/25' : 'border-border bg-card'}`} data-testid={`button-payment-${id}`}>
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${method === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-accent'}`}><Icon size={17} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-foreground">{label}</span>
                <span className="mt-1 block text-[10px] text-muted-foreground">{description}</span>
              </span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${method === id ? 'border-primary' : 'border-border'}`}>{method === id && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Order summary</p>
        <div className="mb-3 space-y-2 rounded-2xl border border-border px-4 py-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-muted-foreground">{cart[item.id]} × {item.name}</span>
              <span className="shrink-0 font-semibold text-accent">₹{item.price * (cart[item.id] ?? 0)}</span>
            </div>
          ))}
        </div>
        <OrderTotals subtotal={subtotal} deliveryFee={deliveryFee} tax={tax} discount={discount} total={total} />
      </div>

      <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">Development payment flow only. No real payment is processed; this button is ready to be connected to a payment gateway later.</p>
      <button type="button" onClick={() => onPay(method)} className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground" data-testid="button-pay-total">
        Pay ₹{total} <ChevronRight size={17} />
      </button>
    </SheetShell>
  );
}

function OrderPlacedSheet({ open, order, items, onTrack, onViewOrder, onClose }: { open: boolean; order: CustomerOrder | null; items: MenuItem[]; onTrack: () => void; onViewOrder: () => void; onClose: () => void }) {
  if (!open || !order) return null;
  return (
    <SheetShell title="Order Placed" eyebrow="Payment successful · demo flow" onClose={onClose} ariaLabel="Order Placed">
      <div className="rounded-[24px] bg-secondary/55 px-5 py-6 text-center">
        <CheckCircle2 className="mx-auto text-[#537b67]" size={42} />
        <h3 className="mt-3 font-display text-3xl text-accent">✓ Order Placed</h3>
        <p className="mt-2 text-xs text-muted-foreground">Your payment was marked successful in the development flow.</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-border px-4 py-3">
        <div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Order ID</p><p className="mt-1 text-xs font-bold text-foreground">#{order.orderId}</p></div>
        <div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Estimated</p><p className="mt-1 text-xs font-bold text-foreground">{order.estimatedDeliveryTime}</p></div>
      </div>
      <div className="mt-3 rounded-2xl bg-background px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Restaurant</p>
        <p className="mt-1 text-sm font-bold text-foreground">{order.restaurantName}</p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Delivering to</p>
        <p className="mt-1 text-xs text-foreground">{order.deliveryAddress.house}, {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.pinCode}</p>
      </div>
      <div className="mt-3 space-y-2 rounded-2xl border border-border px-4 py-3">
        {order.items.map((item) => (
          <div key={item.itemId} className="flex justify-between gap-3 text-xs">
            <span className="min-w-0 truncate text-muted-foreground">{item.quantity} × {item.name}</span>
            <span className="shrink-0 font-semibold text-accent">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <MoneyRow label="Total amount" value={order.total} emphasis />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={onTrack} className="press flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground" data-testid="button-track-order">
          Track Order <Truck size={17} />
        </button>
        <button type="button" onClick={onViewOrder} className="press flex h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold text-foreground" data-testid="button-view-order">
          View Order <ChevronRight size={17} />
        </button>
      </div>
    </SheetShell>
  );
}

function TrackingSheet({ open, order, onClose, onAdvance, onRate }: { open: boolean; order: CustomerOrder | null; onClose: () => void; onAdvance: () => void; onRate: () => void }) {
  if (!open || !order) return null;
  const statusIndex = ORDER_STATUS_SEQUENCE.indexOf(order.orderStatus);
  const isDelivered = order.orderStatus === 'delivered';
  return (
    <SheetShell title={isDelivered ? 'Order Delivered' : 'Live Order Tracking'} eyebrow={`${order.restaurantName} · #${order.orderId}`} onClose={onClose} ariaLabel="Live Order Tracking" wide>
      <div className={`rounded-[24px] px-4 py-4 ${isDelivered ? 'bg-[#edf4ed]' : 'bg-secondary/35'}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-accent">{isDelivered ? <PackageCheck size={20} /> : <Truck size={20} />}</span>
          <div>
            <p className="text-sm font-bold text-foreground">{isDelivered ? 'Order Delivered' : ORDER_STATUS_LABELS[order.orderStatus]}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{isDelivered ? 'Your order has arrived. Enjoy your meal.' : ORDER_STATUS_DESCRIPTIONS[order.orderStatus]}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="rounded-[24px] border border-border bg-background p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Order progress</p>
          <div className="mt-4 space-y-3">
            {ORDER_STATUS_SEQUENCE.map((status, index) => {
              const complete = index <= statusIndex;
              const current = status === order.orderStatus;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${complete ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'} ${current ? 'ring-4 ring-primary/15' : ''}`}>
                    {complete ? <Check size={13} strokeWidth={3} /> : index + 1}
                  </span>
                  <span className={`text-xs ${current ? 'font-bold text-accent' : complete ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{ORDER_STATUS_LABELS[status]}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative min-h-[210px] overflow-hidden rounded-[24px] border border-border bg-[#f0eadf] p-4">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(28deg, transparent 48%, #d8cbb8 49%, #d8cbb8 51%, transparent 52%), linear-gradient(116deg, transparent 48%, #d8cbb8 49%, #d8cbb8 51%, transparent 52%)', backgroundSize: '72px 72px' }} />
          <div className="relative z-[1] flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Delivery map</p>
            <MapPin size={16} className="text-primary" />
          </div>
          <div className="relative z-[1] mt-16 flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground"><Home size={15} /></span>
            <span className="h-px flex-1 border-t-2 border-dashed border-primary/70" />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><MapPin size={15} /></span>
          </div>
          <p className="absolute bottom-3 left-4 right-4 z-[1] text-[10px] leading-relaxed text-muted-foreground">Demo map area. A delivery partner&apos;s verified live location can be connected here through the backend later; this is not real GPS tracking.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Delivering from</p><p className="mt-1 text-xs font-bold text-foreground">{order.restaurantName}</p></div>
          <div className="text-right"><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Estimated delivery</p><p className="mt-1 text-xs font-bold text-accent">{order.estimatedDeliveryTime}</p></div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(' · ')}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{order.deliveryAddress.house}, {order.deliveryAddress.street}, {order.deliveryAddress.city} · {order.deliveryAddress.pinCode}</p>
      </div>

      {!isDelivered ? (
        <button type="button" onClick={onAdvance} className="press mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground" data-testid="button-advance-order-status">
          Demo: advance to {ORDER_STATUS_LABELS[ORDER_STATUS_SEQUENCE[Math.min(statusIndex + 1, ORDER_STATUS_SEQUENCE.length - 1)]]} <ChevronRight size={17} />
        </button>
      ) : (
        <button type="button" onClick={onRate} className="press mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground" data-testid="button-rate-order">
          Rate Your Order <Star size={17} />
        </button>
      )}
    </SheetShell>
  );
}

function RatingSheet({ open, order, onSubmit, onClose }: { open: boolean; order: CustomerOrder | null; onSubmit: (rating: number, review: string, details: CustomerOrder['reviewDetails']) => void; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [foodQuality, setFoodQuality] = useState('');
  const [packaging, setPackaging] = useState('');
  const [deliveryExperience, setDeliveryExperience] = useState('');

  useEffect(() => {
    setRating(order?.customerRating ?? 0);
    setReview(order?.customerReview ?? '');
    setFoodQuality(order?.reviewDetails?.foodQuality ?? '');
    setPackaging(order?.reviewDetails?.packaging ?? '');
    setDeliveryExperience(order?.reviewDetails?.deliveryExperience ?? '');
  }, [order?.orderId, order?.customerRating, order?.customerReview, order?.reviewDetails]);

  if (!open || !order) return null;
  return (
    <SheetShell title="Rate Your Order" eyebrow="Order Delivered" onClose={onClose} ariaLabel="Rate Your Order">
      <div className="rounded-[24px] bg-secondary/45 px-5 py-6 text-center">
        <PackageCheck className="mx-auto text-[#537b67]" size={34} />
        <h3 className="mt-3 font-display text-2xl text-accent">How was your order?</h3>
        <p className="mt-1 text-xs text-muted-foreground">{order.restaurantName} · #{order.orderId}</p>
        <div className="mt-5 flex justify-center gap-2" role="group" aria-label="Rate your order from one to five stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button type="button" key={value} onClick={() => setRating(value)} className={`press flex h-10 w-10 items-center justify-center rounded-full border ${rating >= value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`} aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={rating === value} data-testid={`button-rating-${value}`}>
              <Star size={17} fill={rating >= value ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-bold text-foreground">Write a review</span>
        <textarea value={review} onChange={(event) => setReview(event.target.value)} placeholder="Tell us about your meal" className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" data-testid="input-order-review" />
      </label>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <AddressField label="Food quality (optional)" value={foodQuality} onChange={setFoodQuality} required={false} />
        <AddressField label="Packaging (optional)" value={packaging} onChange={setPackaging} required={false} />
        <AddressField label="Delivery experience (optional)" value={deliveryExperience} onChange={setDeliveryExperience} required={false} />
      </div>
      <button type="button" disabled={!rating} onClick={() => onSubmit(rating, review, { foodQuality, packaging, deliveryExperience })} className="press mt-4 flex h-11 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45" data-testid="button-submit-review">
        Submit Review
      </button>
    </SheetShell>
  );
}

function OrderHistorySheet({ open, orders, onOpenOrder, onClose }: { open: boolean; orders: CustomerOrder[]; onOpenOrder: (order: CustomerOrder) => void; onClose: () => void }) {
  if (!open) return null;
  return (
    <SheetShell title="My Orders" onClose={onClose} ariaLabel="My Orders">
      {orders.length === 0 ? (
        <div className="rounded-2xl bg-muted/70 px-4 py-8 text-center">
          <PackageCheck className="mx-auto text-muted-foreground" size={24} />
          <p className="mt-3 text-sm font-bold text-foreground">No orders yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Your completed and active orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <button type="button" key={order.orderId} onClick={() => onOpenOrder(order)} className="press w-full rounded-2xl border border-border px-4 py-3 text-left hover:bg-muted" data-testid={`button-history-order-${order.orderId}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">{order.restaurantName}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">#{order.orderId} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-secondary-foreground">{ORDER_STATUS_LABELS[order.orderStatus]}</span>
              </div>
              <p className="mt-3 truncate text-[11px] text-muted-foreground">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(' · ')}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-accent">₹{order.total}</span>
                <span className="text-[10px] font-bold text-primary">{order.customerRating ? `${order.customerRating}/5 rated` : 'View order'} <ChevronRight size={13} className="ml-1 inline" /></span>
              </div>
            </button>
          ))}
        </div>
      )}
    </SheetShell>
  );
}

export default function OrderFlow({
  restaurantName,
  restaurantId,
  restaurantDeliveryTime,
  items,
  cart,
  cartOpen,
  orders,
  activeOrder,
  orderView,
  onCloseCart,
  onOrderViewChange,
  onChangeQuantity,
  onRemove,
  onClearCart,
  onOrderCreated,
  onOrderUpdated,
}: {
  restaurantName: string;
  restaurantId: string;
  restaurantDeliveryTime: string;
  items: MenuItem[];
  cart: OrderCart;
  cartOpen: boolean;
  orders: CustomerOrder[];
  activeOrder: CustomerOrder | null;
  orderView: 'tracking' | 'history' | null;
  onCloseCart: () => void;
  onOrderViewChange: (view: 'tracking' | 'history' | null) => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: CustomerOrder) => void;
  onOrderUpdated: (order: CustomerOrder) => void;
}) {
  const [step, setStep] = useState<'address' | 'payment' | 'success' | 'tracking' | 'rating' | 'history' | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem('central-kitchen-saved-addresses') ?? '[]') as DeliveryAddress[];
    } catch {
      return [];
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [offerApplied, setOfferApplied] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem('central-kitchen-saved-addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (orderView) {
      setStep(orderView);
      setViewingOrderId(activeOrder?.orderId ?? null);
    }
  }, [activeOrder?.orderId, orderView]);

  const cartItems = useMemo(() => items.filter((item) => (cart[item.id] ?? 0) > 0), [cart, items]);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);
  const deliveryFee = subtotal >= 299 ? 0 : subtotal > 0 ? 39 : 0;
  const tax = Math.round(subtotal * 0.05);
  const discount = offerApplied ? Math.min(Math.round(subtotal * 0.2), 100) : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;
  const viewedOrder = orders.find((order) => order.orderId === viewingOrderId) ?? activeOrder;

  const closeFlow = () => {
    setStep(null);
    setViewingOrderId(null);
    onOrderViewChange(null);
  };

  const saveAddress = (address: DeliveryAddress) => {
    setAddresses((current) => current.some((saved) => saved.id === address.id) ? current.map((saved) => saved.id === address.id ? address : saved) : [address, ...current]);
  };

  const completePayment = (paymentMethod: PaymentMethod) => {
    if (!selectedAddress || !cartItems.length) return;
    const createdAt = new Date().toISOString();
    const nextOrder: CustomerOrder = {
      orderId: `${Date.now()}`.slice(-8),
      restaurantId,
      restaurantName,
      items: cartItems.map((item) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: cart[item.id] ?? 0,
        variations: [],
        addons: [],
      })),
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      deliveryAddress: selectedAddress,
      paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      createdAt,
      estimatedDeliveryTime: restaurantDeliveryTime,
    };
    onOrderCreated(nextOrder);
    onClearCart();
    setViewingOrderId(nextOrder.orderId);
    setOfferApplied(false);
    setStep('success');
  };

  const advanceOrder = () => {
    if (!viewedOrder) return;
    const index = ORDER_STATUS_SEQUENCE.indexOf(viewedOrder.orderStatus);
    const nextStatus = ORDER_STATUS_SEQUENCE[Math.min(index + 1, ORDER_STATUS_SEQUENCE.length - 1)];
    onOrderUpdated({ ...viewedOrder, orderStatus: nextStatus });
  };

  const submitRating = (rating: number, review: string, details: CustomerOrder['reviewDetails']) => {
    if (!viewedOrder) return;
    onOrderUpdated({ ...viewedOrder, customerRating: rating, customerReview: review.trim(), reviewDetails: details });
    setStep('history');
    onOrderViewChange('history');
  };

  const openHistoryOrder = (order: CustomerOrder) => {
    setViewingOrderId(order.orderId);
    setStep(order.orderStatus === 'delivered' && !order.customerRating ? 'rating' : 'tracking');
  };

  return (
    <>
      <CartSheet
        open={cartOpen && !step}
        restaurantName={restaurantName}
        items={cartItems}
        cart={cart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        discount={discount}
        total={total}
        offerApplied={offerApplied}
        onApplyOffer={() => setOfferApplied((current) => !current)}
        onClose={onCloseCart}
        onChangeQuantity={onChangeQuantity}
        onRemove={onRemove}
        onCheckout={() => { onCloseCart(); setStep('address'); }}
      />
      <AddressSheet
        open={step === 'address'}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={(address) => setSelectedAddressId(address.id)}
        onSave={saveAddress}
        onContinue={() => setStep('payment')}
        onClose={closeFlow}
        onBack={() => { setStep(null); }}
      />
      <PaymentSheet
        open={step === 'payment'}
        address={selectedAddress}
        items={cartItems}
        cart={cart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        discount={discount}
        total={total}
        onPay={completePayment}
        onClose={closeFlow}
        onBack={() => setStep('address')}
      />
      <OrderPlacedSheet
        open={step === 'success'}
        order={viewedOrder}
        items={items}
        onTrack={() => setStep('tracking')}
        onViewOrder={() => setStep('tracking')}
        onClose={closeFlow}
      />
      <TrackingSheet
        open={step === 'tracking'}
        order={viewedOrder}
        onClose={closeFlow}
        onAdvance={advanceOrder}
        onRate={() => setStep('rating')}
      />
      <RatingSheet
        open={step === 'rating' && viewedOrder?.orderStatus === 'delivered'}
        order={viewedOrder}
        onSubmit={submitRating}
        onClose={closeFlow}
      />
      <OrderHistorySheet
        open={step === 'history'}
        orders={orders}
        onOpenOrder={openHistoryOrder}
        onClose={closeFlow}
      />
    </>
  );
}