import { reactive } from 'vue';

// Initial mock data for news articles
const initialNewsArticles = [
  {
    id: '1',
    title: '本地经济显著增长',
    summary: '本市经济在本季度实现了显著增长，各项指标均超出预期。',
    content: '详细数据显示，本市GDP同比增长7%，失业率降至十年最低点。市长表示，这是多项政策共同作用的结果，未来将继续推动创新和发展。主要增长领域包括高新技术产业和现代服务业。',
    publishDate: '2024-05-24T10:00:00Z',
    tags: ['经济', '增长', '本地'],
    category: '财经',
    status: 'published' // Added status
  },
  {
    id: '2',
    title: '房地产市场新政策出台',
    summary: '为应对房价波动，政府今日发布了房地产市场调控新政策。',
    content: '新政策包括提高首付比例、限制购买多套住房等措施，旨在稳定市场预期，促进房地产市场平稳健康发展。专家分析，短期内市场可能会有所降温。',
    publishDate: '2024-05-23T14:30:00Z',
    tags: ['房地产', '政策', '调控'],
    category: '房产',
    status: 'published' // Added status
  },
  {
    id: '3',
    title: '科技创新大会成功举办',
    summary: '一年一度的科技创新大会于昨日闭幕，展示了多项前沿技术。',
    content: '大会吸引了全球数百家科技企业参展，人工智能、量子计算和生物技术成为焦点。多项合作协议在会议期间达成，预计将推动相关产业的快速发展。',
    publishDate: '2024-05-22T09:00:00Z',
    tags: ['科技', '创新', 'AI'],
    category: '科技',
    status: 'published' // Added status
  },
  {
    id: '4',
    title: '环保行动取得积极进展',
    summary: '全市范围内的环保行动初见成效，空气质量持续改善。',
    content: '通过推广清洁能源、加强工业排放监管等措施，本市PM2.5平均浓度同比下降15%。市民对环境改善的满意度显著提升。',
    publishDate: '2024-05-21T11:00:00Z',
    tags: ['环保', '空气质量', '清洁能源'],
    category: '社会',
    status: 'draft' // Added status
  },
  {
    id: '5',
    title: '教育改革方案公布',
    summary: '新的教育改革方案旨在减轻学生负担，促进素质教育。',
    content: '方案包括优化课程设置、改革评价体系、加强教师队伍建设等内容。教育部门表示，将逐步推进改革，确保平稳过渡。',
    publishDate: '2024-05-20T16:00:00Z',
    tags: ['教育', '改革', '素质教育'],
    category: '教育',
    status: 'pending review' // Added status
  },
  {
    id: '6',
    title: '文化艺术节即将开幕',
    summary: '备受期待的年度文化艺术节将于下周拉开帷幕。',
    content: '本届艺术节将有来自世界各地的艺术家参与，带来包括音乐、舞蹈、戏剧等多种形式的表演。活动将持续一个月，预计吸引大量市民和游客。',
    publishDate: '2024-05-19T08:00:00Z',
    tags: ['文化', '艺术', '节日'],
    category: '文化',
    status: 'published' // Added status
  }
];

// Reactive state for admin articles
export const adminArticlesState = reactive({
  articles: [...initialNewsArticles]
});

// CRUD functions for articles
export const getArticles = () => {
  return [...adminArticlesState.articles]; // Return a copy
};

export const addArticle = (article) => {
  const newArticle = {
    ...article,
    id: `news${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`, // Simple unique ID
    publishDate: article.publishDate || new Date().toISOString(), // Default publishDate if not provided
    tags: article.tags || []
  };
  adminArticlesState.articles.unshift(newArticle);
  return newArticle;
};

export const updateArticle = (updatedArticle) => {
  const index = adminArticlesState.articles.findIndex(a => a.id === updatedArticle.id);
  if (index !== -1) {
    adminArticlesState.articles[index] = { ...adminArticlesState.articles[index], ...updatedArticle };
    return adminArticlesState.articles[index];
  }
  return null;
};

export const deleteArticle = (articleId) => {
  const index = adminArticlesState.articles.findIndex(a => a.id === articleId);
  if (index !== -1) {
    adminArticlesState.articles.splice(index, 1);
    return true;
  }
  return false;
};

// Existing function for homepage news (can be kept or refactored if admin uses all articles)
export const getNewsPage = (page = 1, pageSize = 3) => {
  // Filter for published articles for the homepage view
  const publishedArticles = adminArticlesState.articles.filter(article => article.status === 'published');
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  return {
    total: publishedArticles.length,
    news: publishedArticles.slice(start, end)
  };
};

// Helper to get unique categories for filtering
export const getUniqueCategories = () => {
  const categories = adminArticlesState.articles.map(article => article.category);
  return [...new Set(categories)];
};

// Helper to get unique tags for filtering/form selection
export const getUniqueTags = () => {
  const allTags = adminArticlesState.articles.flatMap(article => article.tags);
  return [...new Set(allTags)];
};
