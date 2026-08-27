import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SubscriptionPlan,
  Subscription,
  SubscriptionStatus,
  InventoryItem,
  Supplier,
  Order,
  OrderStatus,
  Delivery,
  DeliveryStatus,
  Rating,
  Complaint,
  ComplaintCategory,
  Notification
} from '../types';
import {
  INITIAL_PLANS,
  INITIAL_INVENTORY,
  INITIAL_SUPPLIERS,
  INITIAL_SUBSCRIPTION,
  INITIAL_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_RATINGS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface DataContextType {
  plans: SubscriptionPlan[];
  subscription: Subscription | null;
  inventory: InventoryItem[];
  suppliers: Supplier[];
  orders: Order[];
  deliveries: Delivery[];
  ratings: Rating[];
  complaints: Complaint[];
  notifications: Notification[];
  
  // Subscription actions
  updateSubscriptionStatus: (status: SubscriptionStatus, pauseUntil?: string) => void;
  toggleSkipNextDelivery: () => void;
  changeSubscriptionPlan: (newPlanId: string) => void;
  createSubscription: (planId: string, deliveryDay: 'Wednesday' | 'Saturday' | 'Sunday', deliverySlot: any, unit: string, address: string) => void;
  
  // Basket & Customization actions
  swapBasketItem: (oldVegetableId: string, newVegetable: InventoryItem) => { success: boolean; message: string };
  addExtraItem: (item: InventoryItem) => void;
  removeExtraItem: (vegetableId: string) => void;
  updateExtraItemQuantity: (vegetableId: string, delta: number) => void;
  
  // Order actions
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, details?: Partial<Order>) => void;
  
  // Delivery actions
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, proofUrl?: string, notes?: string) => void;
  
  // Inventory & Supplier actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryQuantity: (id: string, newQuantity: number) => void;
  
  // Complaints & Ratings
  addComplaint: (orderId: string, orderNumber: string, category: ComplaintCategory, description: string, userId: string, userName: string) => void;
  resolveComplaint: (complaintId: string, notes: string, status: 'resolved' | 'refunded') => void;
  addRating: (orderId: string, orderNumber: string, rating: number, feedback: string, tags: string[], userId: string, userName: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage assisted state persistence
  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('freshverse_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [subscription, setSubscription] = useState<Subscription | null>(() => {
    const saved = localStorage.getItem('freshverse_subscription');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('freshverse_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('freshverse_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('freshverse_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('freshverse_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [ratings, setRatings] = useState<Rating[]>(() => {
    const saved = localStorage.getItem('freshverse_ratings');
    return saved ? JSON.parse(saved) : INITIAL_RATINGS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('freshverse_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('freshverse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('freshverse_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('freshverse_subscription', JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem('freshverse_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('freshverse_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('freshverse_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('freshverse_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('freshverse_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('freshverse_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('freshverse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Subscription methods
  const updateSubscriptionStatus = (status: SubscriptionStatus, pauseUntil?: string) => {
    if (!subscription) return;
    setSubscription({
      ...subscription,
      status,
      pausedUntil: pauseUntil
    });
    
    // Add notification
    addNotification({
      userId: subscription.userId,
      title: status === 'paused' ? 'Subscription Paused' : 'Subscription Resumed',
      message: status === 'paused' 
        ? `Your fresh deliveries are paused until ${pauseUntil || 'further notice'}.` 
        : 'Your regular weekly harvest deliveries have resumed.',
      type: 'subscription'
    });
  };

  const toggleSkipNextDelivery = () => {
    if (!subscription) return;
    const nextSkipped = !subscription.isSkippedNext;
    setSubscription({
      ...subscription,
      isSkippedNext: nextSkipped
    });
    
    addNotification({
      userId: subscription.userId,
      title: nextSkipped ? 'Next Delivery Skipped' : 'Next Delivery Re-activated',
      message: nextSkipped 
        ? `You have skipped the delivery scheduled for ${subscription.nextDeliveryDate}. Next cycle will resume on schedule.`
        : `Your next delivery on ${subscription.nextDeliveryDate} is active.`,
      type: 'subscription'
    });
  };

  const changeSubscriptionPlan = (newPlanId: string) => {
    if (!subscription) return;
    setSubscription({
      ...subscription,
      planId: newPlanId
    });
  };

  const createSubscription = (
    planId: string,
    deliveryDay: 'Wednesday' | 'Saturday' | 'Sunday',
    deliverySlot: any,
    unit: string,
    address: string
  ) => {
    const plan = plans.find(p => p.id === planId) || plans[0];
    const defaultSelected = inventory.slice(0, plan.itemCount).map(item => ({
      vegetableId: item.id,
      name: item.name,
      quantity: item.unit === 'kg' ? '1.0 kg' : item.unit === 'bunch' ? '2 Bunches' : '1 Pack',
      category: item.category,
      imageUrl: item.imageUrl
    }));

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      userId: 'usr-customer-1',
      planId,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      nextDeliveryDate: '2026-08-30',
      deliveryDayOfWeek: deliveryDay,
      deliverySlot,
      basketCustomization: {
        selectedItems: defaultSelected,
        extraItems: []
      },
      address,
      gatedCommunityUnit: unit,
      createdAt: new Date().toISOString()
    };
    setSubscription(newSub);
  };

  // Basket swap & customization
  const swapBasketItem = (oldVegetableId: string, newVegetable: InventoryItem) => {
    if (!subscription) return { success: false, message: 'No active subscription found' };
    
    const plan = plans.find(p => p.id === subscription.planId);
    const maxSwaps = plan?.maxSwapsAllowed || 2;
    const currentSwapsCount = subscription.basketCustomization.selectedItems.filter(i => i.isSwapped).length;
    
    const oldItem = subscription.basketCustomization.selectedItems.find(i => i.vegetableId === oldVegetableId);
    if (!oldItem) return { success: false, message: 'Original item not in basket' };

    // If item was already swapped, allow re-swap without increasing count
    if (!oldItem.isSwapped && currentSwapsCount >= maxSwaps) {
      return { success: false, message: `Maximum ${maxSwaps} swaps allowed for this plan tier.` };
    }

    const updatedSelected = subscription.basketCustomization.selectedItems.map(item => {
      if (item.vegetableId === oldVegetableId) {
        return {
          vegetableId: newVegetable.id,
          name: newVegetable.name,
          quantity: newVegetable.unit === 'kg' ? '1.0 kg' : newVegetable.unit === 'bunch' ? '2 Bunches' : '1 Pack',
          category: newVegetable.category,
          imageUrl: newVegetable.imageUrl,
          isSwapped: true,
          originalVegetableName: item.originalVegetableName || item.name
        };
      }
      return item;
    });

    setSubscription({
      ...subscription,
      basketCustomization: {
        ...subscription.basketCustomization,
        selectedItems: updatedSelected
      }
    });

    return { success: true, message: `Swapped to ${newVegetable.name}!` };
  };

  const addExtraItem = (item: InventoryItem) => {
    if (!subscription) return;
    const existing = subscription.basketCustomization.extraItems.find(e => e.vegetableId === item.id);
    
    let updatedExtras;
    if (existing) {
      updatedExtras = subscription.basketCustomization.extraItems.map(e => 
        e.vegetableId === item.id 
          ? { ...e, quantity: `${parseInt(e.quantity) + 1} ${item.unit}` }
          : e
      );
    } else {
      updatedExtras = [
        ...subscription.basketCustomization.extraItems,
        {
          vegetableId: item.id,
          name: item.name,
          quantity: `1 ${item.unit}`,
          price: item.pricePerUnit,
          imageUrl: item.imageUrl
        }
      ];
    }

    setSubscription({
      ...subscription,
      basketCustomization: {
        ...subscription.basketCustomization,
        extraItems: updatedExtras
      }
    });
  };

  const removeExtraItem = (vegetableId: string) => {
    if (!subscription) return;
    const updatedExtras = subscription.basketCustomization.extraItems.filter(e => e.vegetableId !== vegetableId);
    setSubscription({
      ...subscription,
      basketCustomization: {
        ...subscription.basketCustomization,
        extraItems: updatedExtras
      }
    });
  };

  const updateExtraItemQuantity = (vegetableId: string, delta: number) => {
    if (!subscription) return;
    const existing = subscription.basketCustomization.extraItems.find(e => e.vegetableId === vegetableId);
    if (!existing) return;

    const currentQty = parseInt(existing.quantity) || 1;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      removeExtraItem(vegetableId);
      return;
    }

    const unit = existing.quantity.replace(/[0-9]/g, '').trim() || 'unit';
    const updatedExtras = subscription.basketCustomization.extraItems.map(e => 
      e.vegetableId === vegetableId 
        ? { ...e, quantity: `${newQty} ${unit}` }
        : e
    );

    setSubscription({
      ...subscription,
      basketCustomization: {
        ...subscription.basketCustomization,
        extraItems: updatedExtras
      }
    });
  };

  // Orders
  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      subscriptionId: subscription?.id || 'sub-custom',
      userId: orderData.userId || 'usr-customer-1',
      customerName: orderData.customerName || 'Aarav Sharma',
      customerPhone: orderData.customerPhone || '+91 98765 43210',
      gatedCommunityUnit: orderData.gatedCommunityUnit || 'Villa 42, Palm Grove',
      address: orderData.address || 'Villa 42, Palm Grove Enclave, Phase 1',
      orderNumber: `FV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString(),
      scheduledDeliveryDate: orderData.scheduledDeliveryDate || '2026-08-30',
      deliverySlot: orderData.deliverySlot || 'Morning (7:00 AM - 9:00 AM)',
      items: orderData.items || [],
      status: 'created',
      subtotal: orderData.subtotal || 1199,
      extrasTotal: orderData.extrasTotal || 0,
      deliveryFee: 0,
      totalAmount: orderData.totalAmount || 1199,
      notes: orderData.notes
    };

    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, details?: Partial<Order>) => {
    setOrders(orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          ...details
        };
      }
      return ord;
    }));

    // If marked packed, update or create delivery
    if (status === 'packed') {
      const existingDel = deliveries.find(d => d.orderId === orderId);
      if (!existingDel) {
        const matchingOrder = orders.find(o => o.id === orderId);
        if (matchingOrder) {
          const newDelivery: Delivery = {
            id: `del-${Date.now()}`,
            orderId: matchingOrder.id,
            orderNumber: matchingOrder.orderNumber,
            deliveryPartnerId: 'usr-delivery-1',
            deliveryPartnerName: 'Vikram Singh',
            customerName: matchingOrder.customerName,
            customerPhone: matchingOrder.customerPhone,
            address: matchingOrder.address,
            gatedCommunityUnit: matchingOrder.gatedCommunityUnit,
            deliverySlot: matchingOrder.deliverySlot,
            status: 'assigned',
            assignedAt: new Date().toISOString(),
            estimatedArrival: '7:30 AM - 8:30 AM'
          };
          setDeliveries([newDelivery, ...deliveries]);
        }
      }
    }
  };

  // Delivery
  const updateDeliveryStatus = (deliveryId: string, status: DeliveryStatus, proofUrl?: string, notes?: string) => {
    setDeliveries(deliveries.map(del => {
      if (del.id === deliveryId) {
        return {
          ...del,
          status,
          deliveredAt: status === 'delivered' ? new Date().toISOString() : del.deliveredAt,
          proofPhotoUrl: proofUrl || del.proofPhotoUrl,
          deliveryNotes: notes || del.deliveryNotes
        };
      }
      return del;
    }));

    // Sync order status
    const targetDel = deliveries.find(d => d.id === deliveryId);
    if (targetDel) {
      if (status === 'delivered') {
        updateOrderStatus(targetDel.orderId, 'delivered', {
          deliveredAt: new Date().toISOString(),
          deliveryProofUrl: proofUrl
        });
      } else if (status === 'in_transit' || status === 'reached_gate') {
        updateOrderStatus(targetDel.orderId, 'out_for_delivery');
      }
    }
  };

  // Inventory
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `veg-${Date.now()}`
    };
    setInventory([newItem, ...inventory]);
  };

  const updateInventoryQuantity = (id: string, newQuantity: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, quantityAvailableKg: Math.max(0, newQuantity) } : item
    ));
  };

  // Complaints & Ratings
  const addComplaint = (
    orderId: string,
    orderNumber: string,
    category: ComplaintCategory,
    description: string,
    userId: string,
    userName: string
  ) => {
    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      orderId,
      orderNumber,
      userId,
      userName,
      category,
      description,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setComplaints([newComplaint, ...complaints]);
    
    // Mark order flag
    setOrders(orders.map(o => o.id === orderId ? { ...o, hasComplaint: true } : o));

    addNotification({
      userId,
      title: `Complaint Submitted (${orderNumber})`,
      message: 'Our community care team has received your ticket and will resolve it within 2 hours.',
      type: 'complaint'
    });
  };

  const resolveComplaint = (complaintId: string, resolutionNotes: string, status: 'resolved' | 'refunded') => {
    setComplaints(complaints.map(c => 
      c.id === complaintId 
        ? { ...c, status, resolutionNotes, resolvedAt: new Date().toISOString() } 
        : c
    ));
  };

  const addRating = (
    orderId: string,
    orderNumber: string,
    rating: number,
    writtenFeedback: string,
    tags: string[],
    userId: string,
    userName: string
  ) => {
    const newRating: Rating = {
      id: `rat-${Date.now()}`,
      orderId,
      orderNumber,
      userId,
      userName,
      rating,
      writtenFeedback,
      tags,
      createdAt: new Date().toISOString()
    };
    setRatings([newRating, ...ratings]);
    
    // Update order
    setOrders(orders.map(o => o.id === orderId ? { ...o, hasRating: true } : o));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = (userId: string) => {
    setNotifications(notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const resetToDefaults = () => {
    setPlans(INITIAL_PLANS);
    setSubscription(INITIAL_SUBSCRIPTION);
    setInventory(INITIAL_INVENTORY);
    setSuppliers(INITIAL_SUPPLIERS);
    setOrders(INITIAL_ORDERS);
    setDeliveries(INITIAL_DELIVERIES);
    setRatings(INITIAL_RATINGS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        plans,
        subscription,
        inventory,
        suppliers,
        orders,
        deliveries,
        ratings,
        complaints,
        notifications,
        updateSubscriptionStatus,
        toggleSkipNextDelivery,
        changeSubscriptionPlan,
        createSubscription,
        swapBasketItem,
        addExtraItem,
        removeExtraItem,
        updateExtraItemQuantity,
        createOrder,
        updateOrderStatus,
        updateDeliveryStatus,
        addInventoryItem,
        updateInventoryQuantity,
        addComplaint,
        resolveComplaint,
        addRating,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
