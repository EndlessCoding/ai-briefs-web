import { reactive } from 'vue';

const initialResources = [
  {
    id: 'res001',
    name: 'Google News RSS',
    type: 'RSS Feed',
    url: 'https://news.google.com/rss?hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    status: 'active',
    createdAt: new Date('2023-01-15T10:00:00Z').toISOString()
  },
  {
    id: 'res002',
    name: 'OpenWeatherMap API',
    type: 'API Endpoint',
    url: 'https://api.openweathermap.org/data/2.5/weather',
    status: 'active',
    createdAt: new Date('2023-02-20T14:30:00Z').toISOString()
  },
  {
    id: 'res003',
    name: 'Local Government Site',
    type: 'Website',
    url: 'https://www.examplegov.com/updates',
    status: 'inactive',
    createdAt: new Date('2023-03-10T09:00:00Z').toISOString()
  },
  {
    id: 'res004',
    name: 'TechCrunch RSS',
    type: 'RSS Feed',
    url: 'https://techcrunch.com/feed/',
    status: 'pending',
    createdAt: new Date('2024-05-01T12:00:00Z').toISOString()
  },
  {
    id: 'res005',
    name: 'Academic Journal API',
    type: 'API Endpoint',
    url: 'https://api.examplejournal.com/v1/articles',
    status: 'active',
    createdAt: new Date('2024-04-15T11:00:00Z').toISOString()
  }
];

export const adminResourcesState = reactive({
  resources: [...initialResources] // Use a reactive object to hold the array
});

export const getResources = () => {
  return [...adminResourcesState.resources]; // Return a copy to prevent direct mutation outside of functions
};

export const addResource = (resource) => {
  const newResource = {
    ...resource,
    id: `res${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`, // Simple unique ID
    createdAt: new Date().toISOString()
  };
  adminResourcesState.resources.unshift(newResource); // Add to the beginning
  return newResource;
};

export const updateResource = (updatedResource) => {
  const index = adminResourcesState.resources.findIndex(r => r.id === updatedResource.id);
  if (index !== -1) {
    adminResourcesState.resources[index] = { ...adminResourcesState.resources[index], ...updatedResource };
    return adminResourcesState.resources[index];
  }
  return null;
};

export const deleteResource = (resourceId) => {
  const index = adminResourcesState.resources.findIndex(r => r.id === resourceId);
  if (index !== -1) {
    adminResourcesState.resources.splice(index, 1);
    return true;
  }
  return false;
};
