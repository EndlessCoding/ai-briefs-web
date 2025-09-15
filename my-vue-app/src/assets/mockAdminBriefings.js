import { reactive } from 'vue';
import { adminArticlesState } from './mockNews.js'; // To reference article IDs

// Initial mock data for briefings
const initialBriefings = [
  {
    id: 'brf001',
    title: 'Morning News Digest - 2024-05-25',
    publishDate: new Date('2024-05-25T08:00:00Z').toISOString(),
    status: 'published',
    articlesIncluded: ['1', '3'] // Assuming '1' and '3' are IDs from mockNews.js
  },
  {
    id: 'brf002',
    title: 'Weekend Tech Wrap-up',
    publishDate: new Date('2024-05-26T12:00:00Z').toISOString(),
    status: 'draft',
    articlesIncluded: ['3', '5'] // Assuming '3' and '5' are IDs from mockNews.js
  },
  {
    id: 'brf003',
    title: 'Special Report: Local Economy',
    publishDate: new Date('2024-05-27T10:30:00Z').toISOString(),
    status: 'published',
    articlesIncluded: ['1', '2', '4']
  }
];

// Ensure all articles included in initialBriefings actually exist in adminArticlesState.articles
initialBriefings.forEach(briefing => {
  briefing.articlesIncluded = briefing.articlesIncluded.filter(articleId => 
    adminArticlesState.articles.some(article => article.id === articleId)
  );
});


// Reactive state for admin briefings
export const adminBriefingsState = reactive({
  briefings: [...initialBriefings]
});

// In a real app, these functions would be part of a service layer making API calls.

// CRUD functions for briefings
export const getBriefings = () => {
  // TODO: API Call - This function would be replaced by an API call to GET /api/admin/briefings
  return [...adminBriefingsState.briefings]; 
};

export const addBriefing = (briefing) => {
  // TODO: API Call - This function would be replaced by an API call to POST /api/admin/briefings
  const newBriefing = {
    ...briefing,
    id: `brf${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`, 
    publishDate: briefing.publishDate || new Date().toISOString(),
    articlesIncluded: briefing.articlesIncluded || []
  };
  adminBriefingsState.briefings.unshift(newBriefing);
  return newBriefing;
};

export const updateBriefing = (updatedBriefing) => {
  // TODO: API Call - This function would be replaced by an API call to PUT /api/admin/briefings/:id
  const index = adminBriefingsState.briefings.findIndex(b => b.id === updatedBriefing.id);
  if (index !== -1) {
    adminBriefingsState.briefings[index] = { ...adminBriefingsState.briefings[index], ...updatedBriefing };
    return adminBriefingsState.briefings[index];
  }
  return null;
};

export const deleteBriefing = (briefingId) => {
  // TODO: API Call - This function would be replaced by an API call to DELETE /api/admin/briefings/:id
  const index = adminBriefingsState.briefings.findIndex(b => b.id === briefingId);
  if (index !== -1) {
    adminBriefingsState.briefings.splice(index, 1);
    return true;
  }
  return false;
};
