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

// In a real app, these functions would be part of a service layer making API calls.

export const getResources = () => {
  // TODO: API Call - This function would be replaced by an API call to GET /api/admin/resources
  return [...adminResourcesState.resources]; 
};

export const addResource = (resource) => {
  // TODO: API Call - This function would be replaced by an API call to POST /api/admin/resources
  const newResource = {
    ...resource,
    id: `res${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`, 
    createdAt: new Date().toISOString()
  };
  adminResourcesState.resources.unshift(newResource); 
  return newResource;
};

export const updateResource = (updatedResource) => {
  // TODO: API Call - This function would be replaced by an API call to PUT /api/admin/resources/:id
  const index = adminResourcesState.resources.findIndex(r => r.id === updatedResource.id);
  if (index !== -1) {
    adminResourcesState.resources[index] = { ...adminResourcesState.resources[index], ...updatedResource };
    return adminResourcesState.resources[index];
  }
  return null;
};

export const deleteResource = (resourceId) => {
  // TODO: API Call - This function would be replaced by an API call to DELETE /api/admin/resources/:id
  const index = adminResourcesState.resources.findIndex(r => r.id === resourceId);
  if (index !== -1) {
    adminResourcesState.resources.splice(index, 1);
    return true;
  }
  return false;
};
