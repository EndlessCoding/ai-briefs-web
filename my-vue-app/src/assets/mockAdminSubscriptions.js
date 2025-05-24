import { reactive } from 'vue';

// Initial mock data for subscriptions
const initialSubscriptions = [
  {
    id: 'sub001',
    email: 'subscriber1@example.com',
    subscribedDate: new Date('2023-01-10T09:00:00Z').toISOString(),
    status: 'active'
  },
  {
    id: 'sub002',
    email: 'testuser@example.com', // From mockUser.js
    subscribedDate: new Date('2023-02-15T11:30:00Z').toISOString(),
    status: 'active'
  },
  {
    id: 'sub003',
    email: 'another@example.com',
    subscribedDate: new Date('2023-03-01T17:45:00Z').toISOString(),
    status: 'inactive'
  },
  {
    id: 'sub004',
    email: 'former.subscriber@example.com',
    subscribedDate: new Date('2022-12-05T10:00:00Z').toISOString(),
    status: 'unsubscribed'
  },
  {
    id: 'sub005',
    email: 'new.lead@example.com',
    subscribedDate: new Date('2024-05-20T14:00:00Z').toISOString(),
    status: 'active'
  }
];

// Reactive state for admin subscriptions
export const adminSubscriptionsState = reactive({
  subscriptions: [...initialSubscriptions]
});

// In a real app, these functions would be part of a service layer making API calls.

// CRUD functions for subscriptions
export const getSubscriptions = () => {
  // TODO: API Call - This function would be replaced by an API call to GET /api/admin/subscriptions
  return [...adminSubscriptionsState.subscriptions]; 
};

export const addSubscription = (subscription) => {
  // TODO: API Call - This function would be replaced by an API call to POST /api/admin/subscriptions
  if (adminSubscriptionsState.subscriptions.some(s => s.email === subscription.email)) {
    console.warn(`Subscription with email ${subscription.email} already exists.`);
    return null; 
  }
  const newSubscription = {
    ...subscription,
    id: `sub${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`, 
    subscribedDate: subscription.subscribedDate || new Date().toISOString()
  };
  adminSubscriptionsState.subscriptions.unshift(newSubscription);
  return newSubscription;
};

export const updateSubscriptionStatus = (subscriptionId, newStatus) => {
  // TODO: API Call - This function would be replaced by an API call to PATCH /api/admin/subscriptions/:id/status
  const index = adminSubscriptionsState.subscriptions.findIndex(s => s.id === subscriptionId);
  if (index !== -1) {
    adminSubscriptionsState.subscriptions[index].status = newStatus;
    return adminSubscriptionsState.subscriptions[index];
  }
  return null;
};

export const updateSubscription = (updatedSubscription) => {
    // TODO: API Call - This function would be replaced by an API call to PUT /api/admin/subscriptions/:id
    const index = adminSubscriptionsState.subscriptions.findIndex(s => s.id === updatedSubscription.id);
    if (index !== -1) {
      adminSubscriptionsState.subscriptions[index] = { ...adminSubscriptionsState.subscriptions[index], ...updatedSubscription };
      return adminSubscriptionsState.subscriptions[index];
    }
    return null;
};


export const deleteSubscription = (subscriptionId) => {
  // TODO: API Call - This function would be replaced by an API call to DELETE /api/admin/subscriptions/:id
  const index = adminSubscriptionsState.subscriptions.findIndex(s => s.id === subscriptionId);
  if (index !== -1) {
    adminSubscriptionsState.subscriptions.splice(index, 1);
    return true;
  }
  return false;
};
