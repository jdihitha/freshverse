import {
  User,
  SubscriptionPlan,
  Subscription,
  InventoryItem,
  Supplier,
  Order,
  Delivery,
  Rating,
  Complaint,
  Notification
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'customer',
    address: 'Villa 42, Palm Grove Enclave, Phase 1',
    gatedCommunityUnit: 'Villa 42, Palm Grove',
    createdAt: '2026-01-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-admin-1',
    name: 'Elena Vance',
    email: 'admin@freshverse.farm',
    phone: '+91 98111 22334',
    role: 'admin',
    address: 'Operations Hub, Green Acres Farm Complex',
    gatedCommunityUnit: 'Admin HQ',
    createdAt: '2025-11-01T08:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-packing-1',
    name: 'Ramesh Patel',
    email: 'packing@freshverse.farm',
    phone: '+91 97222 33445',
    role: 'packing',
    address: 'Packing Station 2, Central Dispatch Facility',
    gatedCommunityUnit: 'Facility Station 2',
    createdAt: '2026-02-01T09:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-delivery-1',
    name: 'Vikram Singh',
    email: 'delivery@freshverse.farm',
    phone: '+91 99888 77665',
    role: 'delivery',
    address: 'South Gate Dispatch Bay',
    gatedCommunityUnit: 'EV Logistics Bay #4',
    createdAt: '2026-02-10T07:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-supplier-1',
    name: 'Sunil Kumar (Kisan Organic Farm)',
    email: 'sunil@kisanorganic.in',
    phone: '+91 94555 66778',
    role: 'supplier',
    address: 'Plot 18, Eco Valley Green Belt, Mysore Road',
    gatedCommunityUnit: 'Partner Farm #07',
    createdAt: '2025-12-10T11:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-essential',
    name: 'Essential Harvest Basket',
    tagLine: 'Perfect for couples & small households',
    description: 'Curated balanced selection of 8 farm-fresh daily essential vegetables, harvested the night before delivery.',
    price: 699,
    frequency: 'Weekly',
    basketSizeWeight: '5.5 - 6.5 kg',
    itemCount: 8,
    maxSwapsAllowed: 2,
    features: [
      '8 Curated Seasonal Vegetables',
      'Harvested within 12 hours of packing',
      'Up to 2 item swaps per weekly basket',
      'Free morning doorstep delivery to your gate',
      'Pause, skip, or cancel anytime'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    isPopular: false,
    idealFor: '1 - 2 people'
  },
  {
    id: 'plan-family',
    name: 'Gourmet Family Feast',
    tagLine: 'Our most loved complete kitchen basket',
    description: 'Generous 14-item harvest including staple kitchen roots, exotic gourds, crunchy greens, and aromatic culinary herbs.',
    price: 1199,
    frequency: 'Weekly',
    basketSizeWeight: '9.5 - 11.0 kg',
    itemCount: 14,
    maxSwapsAllowed: 4,
    features: [
      '14 Curated Fresh & Exotic Vegetables',
      'Complimentary organic herb bouquet (Coriander, Mint & Basil)',
      'Up to 4 custom item swaps',
      'Insulated eco-friendly tote packaging',
      'Priority morning doorstep delivery',
      'Zero cancellation fees'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    idealFor: '3 - 5 people'
  },
  {
    id: 'plan-vitality',
    name: 'Vitality & Clean Greens',
    tagLine: 'High fiber, low carb, detox-focused',
    description: 'Crafted for wellness-focused homes with crisp lettuces, hydroponic microgreens, broccoli, zucchini, and nutrient-dense roots.',
    price: 899,
    frequency: 'Weekly',
    basketSizeWeight: '6.5 - 7.5 kg',
    itemCount: 10,
    maxSwapsAllowed: 3,
    features: [
      '10 Nutrient-dense Greens & Super-veggies',
      'Includes Hydroponic Greens & Microgreens',
      '3 Item swaps supported',
      'Triple-rinsed in purified ozonated water',
      'Delivered twice-weekly option available'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    isPopular: false,
    idealFor: 'Wellness enthusiasts'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Sunil Kumar',
    farmName: 'Kisan Valley Organic Farm',
    location: 'Eco Belt, Kanakapura Valley',
    contactNumber: '+91 94555 66778',
    email: 'sunil@kisanorganic.in',
    certification: 'Jaivik Bharat & PGS-India Organic',
    rating: 4.9,
    activeCropsCount: 12,
    joinedDate: '2025-08-10'
  },
  {
    id: 'sup-2',
    name: 'Vandana Hedge',
    farmName: 'Sahyadri Highlands Produce',
    location: 'Sirsi Foothills',
    contactNumber: '+91 98333 44556',
    email: 'vandana@sahyadrihighlands.com',
    certification: 'Global G.A.P. Certified',
    rating: 4.8,
    activeCropsCount: 9,
    joinedDate: '2025-10-15'
  },
  {
    id: 'sup-3',
    name: 'Anand Murthy',
    farmName: 'GreenRoots Hydroponics',
    location: 'Hosur Agro Tech Park',
    contactNumber: '+91 91234 56780',
    email: 'contact@greenroots.tech',
    certification: 'Zero Pesticide Certified',
    rating: 4.95,
    activeCropsCount: 7,
    joinedDate: '2026-01-05'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'veg-1',
    supplierId: 'sup-1',
    supplierName: 'Kisan Valley Organic Farm',
    name: 'Crisp Farm Spinach (Palak)',
    category: 'leafy',
    quantityAvailableKg: 85,
    unit: 'bunch',
    pricePerUnit: 35,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Organic Certified',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Tender baby spinach leaves, packed with iron and vitamins. Harvested at sunrise.'
  },
  {
    id: 'veg-2',
    supplierId: 'sup-1',
    supplierName: 'Kisan Valley Organic Farm',
    name: 'Vine-Ripened Cherry Tomatoes',
    category: 'staples',
    quantityAvailableKg: 120,
    unit: 'kg',
    pricePerUnit: 60,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Grade A+',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Plump, naturally sweet ruby red tomatoes bursting with fresh tangy juice.'
  },
  {
    id: 'veg-3',
    supplierId: 'sup-2',
    supplierName: 'Sahyadri Highlands Produce',
    name: 'Tender English Cucumbers',
    category: 'gourd',
    quantityAvailableKg: 95,
    unit: 'kg',
    pricePerUnit: 45,
    harvestDate: '2026-08-25',
    freshnessGrade: 'Farm Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Thin-skinned, seedless crunchy cucumbers ideal for salads and hydrating juices.'
  },
  {
    id: 'veg-4',
    supplierId: 'sup-2',
    supplierName: 'Sahyadri Highlands Produce',
    name: 'Fresh Hill Broccoli',
    category: 'cruciferous',
    quantityAvailableKg: 60,
    unit: 'piece',
    pricePerUnit: 70,
    harvestDate: '2026-08-25',
    freshnessGrade: 'Grade A+',
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Tight, dark emerald crowns grown in misty highland conditions for optimal crunch.'
  },
  {
    id: 'veg-5',
    supplierId: 'sup-1',
    supplierName: 'Kisan Valley Organic Farm',
    name: 'Sweet Orange Carrots',
    category: 'root',
    quantityAvailableKg: 140,
    unit: 'kg',
    pricePerUnit: 50,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Organic Certified',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Hand-pulled earth-sweet carrots, rich in beta-carotene and natural crunch.'
  },
  {
    id: 'veg-6',
    supplierId: 'sup-1',
    supplierName: 'Kisan Valley Organic Farm',
    name: 'Fresh Green Capsicum',
    category: 'staples',
    quantityAvailableKg: 75,
    unit: 'kg',
    pricePerUnit: 55,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Grade A+',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Glossy, thick-walled bell peppers with a pleasant crisp sweetness.'
  },
  {
    id: 'veg-7',
    supplierId: 'sup-2',
    supplierName: 'Sahyadri Highlands Produce',
    name: 'Baby Green Zucchini',
    category: 'gourd',
    quantityAvailableKg: 45,
    unit: 'kg',
    pricePerUnit: 80,
    harvestDate: '2026-08-25',
    freshnessGrade: 'Organic Certified',
    imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Silky, tender zucchini perfect for stir-fries, roasting, or raw spiral salads.'
  },
  {
    id: 'veg-8',
    supplierId: 'sup-3',
    supplierName: 'GreenRoots Hydroponics',
    name: 'Hydroponic Butterhead Lettuce',
    category: 'leafy',
    quantityAvailableKg: 50,
    unit: 'pack',
    pricePerUnit: 65,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Grade A+',
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Living root lettuce with tender buttery leaves, pesticide-free greenhouse grown.'
  },
  {
    id: 'veg-9',
    supplierId: 'sup-3',
    supplierName: 'GreenRoots Hydroponics',
    name: 'Aromatic Italian Basil & Mint',
    category: 'herbs',
    quantityAvailableKg: 30,
    unit: 'pack',
    pricePerUnit: 40,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Organic Certified',
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: false,
    description: 'Fragrant sweet genovese basil paired with fresh spearmint bunch.'
  },
  {
    id: 'veg-10',
    supplierId: 'sup-2',
    supplierName: 'Sahyadri Highlands Produce',
    name: 'Tender Bottle Gourd (Lauki)',
    category: 'gourd',
    quantityAvailableKg: 90,
    unit: 'piece',
    pricePerUnit: 40,
    harvestDate: '2026-08-25',
    freshnessGrade: 'Farm Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Light, tender gourd with soft skin, ideal for light curries and wellness juices.'
  },
  {
    id: 'veg-11',
    supplierId: 'sup-1',
    supplierName: 'Kisan Valley Organic Farm',
    name: 'Golden Baby Potatoes',
    category: 'root',
    quantityAvailableKg: 160,
    unit: 'kg',
    pricePerUnit: 45,
    harvestDate: '2026-08-24',
    freshnessGrade: 'Farm Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Thin-skinned creamy baby potatoes, perfect for roasting whole with herbs.'
  },
  {
    id: 'veg-12',
    supplierId: 'sup-3',
    supplierName: 'GreenRoots Hydroponics',
    name: 'Exotic Button Mushrooms',
    category: 'specialty',
    quantityAvailableKg: 40,
    unit: 'pack',
    pricePerUnit: 75,
    harvestDate: '2026-08-26',
    freshnessGrade: 'Grade A+',
    imageUrl: 'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=400&auto=format&fit=crop&q=80',
    isExtraItem: true,
    isAvailableForSwap: true,
    description: 'Firm, pristine white closed-cup button mushrooms harvested in sterile indoor units.'
  }
];

export const INITIAL_SUBSCRIPTION: Subscription = {
  id: 'sub-aarav-1',
  userId: 'usr-customer-1',
  planId: 'plan-family',
  status: 'active',
  startDate: '2026-02-01',
  nextDeliveryDate: '2026-08-29',
  deliveryDayOfWeek: 'Saturday',
  deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
  basketCustomization: {
    selectedItems: [
      { vegetableId: 'veg-1', name: 'Crisp Farm Spinach (Palak)', quantity: '2 Bunches', category: 'leafy', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-2', name: 'Vine-Ripened Cherry Tomatoes', quantity: '1.0 kg', category: 'staples', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-3', name: 'Tender English Cucumbers', quantity: '1.0 kg', category: 'gourd', imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-4', name: 'Fresh Hill Broccoli', quantity: '2 Heads (~800g)', category: 'cruciferous', imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-5', name: 'Sweet Orange Carrots', quantity: '1.0 kg', category: 'root', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-6', name: 'Fresh Green Capsicum', quantity: '750 g', category: 'staples', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-8', name: 'Hydroponic Butterhead Lettuce', quantity: '1 Head', category: 'leafy', imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&auto=format&fit=crop&q=80', isSwapped: true, originalVegetableName: 'Tender Bottle Gourd' },
      { vegetableId: 'veg-11', name: 'Golden Baby Potatoes', quantity: '1.5 kg', category: 'root', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80' }
    ],
    extraItems: [
      { vegetableId: 'veg-9', name: 'Aromatic Italian Basil & Mint', quantity: '1 pack', price: 40, imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80' },
      { vegetableId: 'veg-12', name: 'Exotic Button Mushrooms', quantity: '1 pack (200g)', price: 75, imageUrl: 'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=400&auto=format&fit=crop&q=80' }
    ]
  },
  address: 'Villa 42, Palm Grove Enclave, Phase 1',
  gatedCommunityUnit: 'Villa 42, Palm Grove',
  createdAt: '2026-02-01T00:00:00Z'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8831',
    subscriptionId: 'sub-aarav-1',
    userId: 'usr-customer-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    gatedCommunityUnit: 'Villa 42, Palm Grove',
    address: 'Villa 42, Palm Grove Enclave, Phase 1',
    orderNumber: 'FV-2026-8831',
    orderDate: '2026-08-26T06:00:00Z',
    scheduledDeliveryDate: '2026-08-27',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'out_for_delivery',
    items: [
      { name: 'Crisp Farm Spinach (Palak)', quantity: '2 Bunches', category: 'leafy' },
      { name: 'Vine-Ripened Cherry Tomatoes', quantity: '1.0 kg', category: 'staples' },
      { name: 'Tender English Cucumbers', quantity: '1.0 kg', category: 'gourd' },
      { name: 'Fresh Hill Broccoli', quantity: '2 Heads', category: 'cruciferous' },
      { name: 'Sweet Orange Carrots', quantity: '1.0 kg', category: 'root' },
      { name: 'Fresh Green Capsicum', quantity: '750 g', category: 'staples' },
      { name: 'Hydroponic Butterhead Lettuce', quantity: '1 Head', category: 'leafy' },
      { name: 'Golden Baby Potatoes', quantity: '1.5 kg', category: 'root' },
      { name: 'Aromatic Italian Basil & Mint', quantity: '1 pack', category: 'herbs', isExtra: true, price: 40 },
      { name: 'Exotic Button Mushrooms', quantity: '1 pack', category: 'specialty', isExtra: true, price: 75 }
    ],
    subtotal: 1199,
    extrasTotal: 115,
    deliveryFee: 0,
    totalAmount: 1314,
    packedBy: 'Ramesh Patel',
    packedAt: '2026-08-26T18:30:00Z',
    deliveryPartnerId: 'usr-delivery-1',
    deliveryPartnerName: 'Vikram Singh',
    notes: 'Please leave in the porch thermal basket if gate bell is silent.'
  },
  {
    id: 'ord-8720',
    subscriptionId: 'sub-aarav-1',
    userId: 'usr-customer-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    gatedCommunityUnit: 'Villa 42, Palm Grove',
    address: 'Villa 42, Palm Grove Enclave, Phase 1',
    orderNumber: 'FV-2026-8720',
    orderDate: '2026-08-19T06:00:00Z',
    scheduledDeliveryDate: '2026-08-20',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'delivered',
    items: [
      { name: 'Crisp Farm Spinach (Palak)', quantity: '2 Bunches', category: 'leafy' },
      { name: 'Vine-Ripened Cherry Tomatoes', quantity: '1.0 kg', category: 'staples' },
      { name: 'Fresh Hill Broccoli', quantity: '2 Heads', category: 'cruciferous' },
      { name: 'Golden Baby Potatoes', quantity: '2.0 kg', category: 'root' },
      { name: 'Tender English Cucumbers', quantity: '1.0 kg', category: 'gourd' }
    ],
    subtotal: 1199,
    extrasTotal: 0,
    deliveryFee: 0,
    totalAmount: 1199,
    packedBy: 'Ramesh Patel',
    packedAt: '2026-08-19T18:00:00Z',
    deliveryPartnerId: 'usr-delivery-1',
    deliveryPartnerName: 'Vikram Singh',
    deliveredAt: '2026-08-20T07:42:00Z',
    deliveryProofUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
    hasRating: true
  },
  {
    id: 'ord-8605',
    subscriptionId: 'sub-aarav-1',
    userId: 'usr-customer-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    gatedCommunityUnit: 'Villa 42, Palm Grove',
    address: 'Villa 42, Palm Grove Enclave, Phase 1',
    orderNumber: 'FV-2026-8605',
    orderDate: '2026-08-12T06:00:00Z',
    scheduledDeliveryDate: '2026-08-13',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'delivered',
    items: [
      { name: 'Essential Seasonal Harvest Basket', quantity: '1 Basket', category: 'staples' }
    ],
    subtotal: 1199,
    extrasTotal: 0,
    deliveryFee: 0,
    totalAmount: 1199,
    packedBy: 'Ramesh Patel',
    packedAt: '2026-08-12T17:45:00Z',
    deliveryPartnerId: 'usr-delivery-1',
    deliveryPartnerName: 'Vikram Singh',
    deliveredAt: '2026-08-13T08:15:00Z',
    hasComplaint: false
  },
  {
    id: 'ord-8901',
    subscriptionId: 'sub-community-2',
    userId: 'usr-comm-2',
    customerName: 'Priya Narayanan',
    customerPhone: '+91 98444 11223',
    gatedCommunityUnit: 'Apartment 304, Orchid Block',
    address: 'Apt 304, Orchid Block, Palm Grove',
    orderNumber: 'FV-2026-8901',
    orderDate: '2026-08-26T08:00:00Z',
    scheduledDeliveryDate: '2026-08-27',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'packing',
    items: [
      { name: 'Essential Harvest Basket', quantity: '1 Basket (6.0 kg)', category: 'staples' }
    ],
    subtotal: 699,
    extrasTotal: 0,
    deliveryFee: 0,
    totalAmount: 699,
    notes: 'Please buzz intercom 304 upon arrival.'
  },
  {
    id: 'ord-8902',
    subscriptionId: 'sub-community-3',
    userId: 'usr-comm-3',
    customerName: 'Dr. Kabir Sen',
    customerPhone: '+91 98222 99887',
    gatedCommunityUnit: 'Villa 14, Silver Oak Lane',
    address: 'Villa 14, Silver Oak Lane, Palm Grove',
    orderNumber: 'FV-2026-8902',
    orderDate: '2026-08-26T08:30:00Z',
    scheduledDeliveryDate: '2026-08-27',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'created',
    items: [
      { name: 'Vitality & Clean Greens Basket', quantity: '1 Basket', category: 'leafy' },
      { name: 'Exotic Button Mushrooms', quantity: '2 packs', category: 'specialty', isExtra: true, price: 150 }
    ],
    subtotal: 899,
    extrasTotal: 150,
    deliveryFee: 0,
    totalAmount: 1049
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del-101',
    orderId: 'ord-8831',
    orderNumber: 'FV-2026-8831',
    deliveryPartnerId: 'usr-delivery-1',
    deliveryPartnerName: 'Vikram Singh',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    address: 'Villa 42, Palm Grove Enclave, Phase 1',
    gatedCommunityUnit: 'Villa 42, Palm Grove',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'in_transit',
    assignedAt: '2026-08-26T19:00:00Z',
    estimatedArrival: 'Tomorrow, 7:35 AM',
    deliveryNotes: 'Leave in thermal pouch on front door stoop'
  },
  {
    id: 'del-102',
    orderId: 'ord-8901',
    orderNumber: 'FV-2026-8901',
    deliveryPartnerId: 'usr-delivery-1',
    deliveryPartnerName: 'Vikram Singh',
    customerName: 'Priya Narayanan',
    customerPhone: '+91 98444 11223',
    address: 'Apt 304, Orchid Block, Palm Grove',
    gatedCommunityUnit: 'Apartment 304, Orchid Block',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'assigned',
    assignedAt: '2026-08-26T19:15:00Z',
    estimatedArrival: 'Tomorrow, 7:50 AM'
  },
  {
    id: 'del-100',
    orderId: 'ord-8720',
    orderNumber: 'FV-2026-8720',
    deliveryPartnerId: 'usr-delivery-1',
    deliveryPartnerName: 'Vikram Singh',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    address: 'Villa 42, Palm Grove Enclave, Phase 1',
    gatedCommunityUnit: 'Villa 42, Palm Grove',
    deliverySlot: 'Morning (7:00 AM - 9:00 AM)',
    status: 'delivered',
    assignedAt: '2026-08-19T18:30:00Z',
    deliveredAt: '2026-08-20T07:42:00Z',
    estimatedArrival: 'Delivered',
    proofPhotoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
    deliveryNotes: 'Handed directly to resident'
  }
];

export const INITIAL_RATINGS: Rating[] = [
  {
    id: 'rat-1',
    orderId: 'ord-8720',
    orderNumber: 'FV-2026-8720',
    userId: 'usr-customer-1',
    userName: 'Aarav Sharma',
    rating: 5,
    writtenFeedback: 'Exceptional freshness! The spinach was crisp without a single bruised leaf, and the baby potatoes were delicious when roasted.',
    tags: ['Super Fresh', 'On Time', 'Carefully Packed', 'Great Taste'],
    createdAt: '2026-08-20T09:15:00Z'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-1',
    orderId: 'ord-8605',
    orderNumber: 'FV-2026-8605',
    userId: 'usr-customer-1',
    userName: 'Aarav Sharma',
    category: 'quality_issue',
    description: 'One bunch of mint had some wilting due to heat during transport.',
    status: 'resolved',
    resolutionNotes: 'Fresh mint bunch credited to customer wallet and added as complimentary bonus to next delivery.',
    createdAt: '2026-08-13T10:00:00Z',
    resolvedAt: '2026-08-13T14:20:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-customer-1',
    title: 'Basket packed with fresh morning harvest',
    message: 'Your upcoming Saturday basket #FV-2026-8831 has been inspected and packed with grade A+ produce.',
    type: 'delivery',
    isRead: false,
    createdAt: '2026-08-26T18:30:00Z',
    actionUrl: '/customer/orders'
  },
  {
    id: 'notif-2',
    userId: 'usr-customer-1',
    title: 'Basket Customization Window Open',
    message: 'You have until Friday 8:00 PM to swap vegetables or add specialty extras for your next delivery.',
    type: 'subscription',
    isRead: true,
    createdAt: '2026-08-25T09:00:00Z',
    actionUrl: '/customer/basket'
  },
  {
    id: 'notif-3',
    userId: 'usr-customer-1',
    title: 'Farmer Sunil harvested fresh Sweet Carrots',
    message: 'Kisan Organic Farm just harvested 140kg fresh carrots now available for basket swaps.',
    type: 'inventory',
    isRead: true,
    createdAt: '2026-08-24T16:00:00Z',
    actionUrl: '/customer/basket'
  }
];
