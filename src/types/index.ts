export type UserRole = 'customer' | 'admin' | 'packing' | 'delivery' | 'supplier';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  gatedCommunityUnit?: string;
  createdAt: string;
  avatarUrl?: string;
}

export type PlanFrequency = 'Weekly' | 'Bi-Weekly' | 'Monthly';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagLine: string;
  description: string;
  price: number;
  frequency: PlanFrequency;
  basketSizeWeight: string;
  itemCount: number;
  maxSwapsAllowed: number;
  features: string[];
  imageUrl: string;
  isPopular?: boolean;
  idealFor: string;
}

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'pending';

export interface BasketItemCustomization {
  vegetableId: string;
  name: string;
  quantity: string;
  category: string;
  imageUrl?: string;
  isSwapped?: boolean;
  originalVegetableName?: string;
}

export interface ExtraItemCustomization {
  vegetableId: string;
  name: string;
  quantity: string;
  price: number;
  imageUrl?: string;
}

export interface BasketCustomization {
  selectedItems: BasketItemCustomization[];
  extraItems: ExtraItemCustomization[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  nextDeliveryDate: string;
  deliveryDayOfWeek: 'Wednesday' | 'Saturday' | 'Sunday';
  deliverySlot: string;
  basketCustomization: BasketCustomization;
  pausedUntil?: string;
  isSkippedNext?: boolean;
  address: string;
  gatedCommunityUnit: string;
  createdAt: string;
}

export type VegetableCategory = 
  | 'leafy' 
  | 'root' 
  | 'gourd' 
  | 'cruciferous' 
  | 'herbs' 
  | 'specialty' 
  | 'staples'
  | string;

export interface InventoryItem {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  category: VegetableCategory;
  stockAvailableKg?: number;
  quantityAvailableKg?: number;
  unit: 'kg' | 'bunch' | 'pack' | 'piece' | string;
  pricePerUnit: number;
  harvestDate: string;
  freshnessGrade: string;
  imageUrl: string;
  isExtraItem: boolean;
  isAvailableForSwap: boolean;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  farmName: string;
  location: string;
  contactNumber: string;
  email: string;
  certification: string;
  rating: number;
  activeCropsCount: number;
  joinedDate: string;
}

export type OrderStatus = 
  | 'created'
  | 'confirmed'
  | 'harvested'
  | 'packing' 
  | 'packed' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: string;
  category: string;
  isExtra?: boolean;
  price?: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  subscriptionId?: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  gatedCommunityUnit: string;
  address: string;
  orderNumber: string;
  orderDate?: string;
  scheduledDeliveryDate: string;
  deliverySlot: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  extrasTotal: number;
  deliveryFee?: number;
  totalAmount: number;
  packedBy?: string;
  packedAt?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveredAt?: string;
  deliveryProofUrl?: string;
  notes?: string;
  hasRating?: boolean;
  hasComplaint?: boolean;
}

export type DeliveryStatus = 'assigned' | 'in_transit' | 'reached_gate' | 'delivered';

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  vehicleNumber?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  gatedCommunityUnit: string;
  deliverySlot: string;
  status: DeliveryStatus;
  assignedAt: string;
  packedBy?: string;
  deliveredAt?: string;
  photoProofUrl?: string;
  proofPhotoUrl?: string;
  deliveryNotes?: string;
  estimatedArrival: string;
}

export interface Rating {
  id: string;
  orderId: string;
  orderNumber?: string;
  userId: string;
  customerName?: string;
  userName?: string;
  rating?: number;
  freshnessScore?: number;
  packagingScore?: number;
  deliveryScore?: number;
  comment?: string;
  writtenFeedback?: string;
  tags?: string[];
  createdAt: string;
}

export type ComplaintCategory = 
  | 'quality'
  | 'quality_issue' 
  | 'missing_item' 
  | 'damaged'
  | 'damaged_produce' 
  | 'late_delivery' 
  | 'wrong_item';

export interface Complaint {
  id: string;
  orderId: string;
  orderNumber?: string;
  userId: string;
  customerName?: string;
  userName?: string;
  category?: ComplaintCategory;
  issueType?: 'quality' | 'missing_item' | 'damaged' | 'late_delivery' | 'wrong_item' | string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'refunded';
  photoUrl?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type NotificationType = 
  | 'delivery' 
  | 'subscription' 
  | 'payment' 
  | 'complaint' 
  | 'inventory' 
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
