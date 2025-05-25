<template>
  <div class="category-page">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="!categoryExists" class="empty-state category-not-found">
      <el-empty :description="`分类 '${currentCategoryName}' 未找到`">
        <p>抱歉，我们无法找到您请求的分类。</p>
        <router-link to="/"><el-button type="primary">返回首页</el-button></router-link>
      </el-empty>
    </div>

    <div v-else class="category-content">
      <h1 class="page-title">分类: {{ currentCategoryName }}</h1>
      
      <div v-if="filteredNews.length === 0" class="empty-state no-articles">
         <el-empty :description="`分类 '${currentCategoryName}' 下暂无已发布的文章`">
            <p>请稍后再试，或浏览其他分类。</p>
         </el-empty>
      </div>

      <div v-else class="news-list-container">
        <el-row :gutter="24"> {/* Consistent with HomePage */}
          <el-col :xs="24" :sm="12" :md="8" v-for="newsItem in paginatedNews" :key="newsItem.id" class="news-col">
            {/* Replicated news item card structure and classes from HomePage.vue */}
            <el-card class="news-item-card" shadow="hover">
              <div class="news-item-image-placeholder">
                <span>图像占位</span>
              </div>
              <div class="news-item-content">
                <h3 class="news-item-title">{{ newsItem.title }}</h3>
                <p class="news-item-summary">{{ newsItem.summary }}</p>
                <div class="news-item-meta">
                  <span class="news-item-category">
                    {/* Category tag is less relevant here as all items are of the currentCategoryName */}
                    {/* <el-tag size="small" effect="light" :type="getCategoryTagType(newsItem.category)">
                      {{ newsItem.category }}
                    </el-tag> */}
                  </span>
                  <time class="news-item-time">{{ formatPublishDate(newsItem.publishDate) }}</time>
                </div>
                <div class="news-item-tags" v-if="newsItem.tags && newsItem.tags.length">
                  <el-tag 
                    v-for="tag in newsItem.tags" :key="tag" 
                    size="small" effect="plain" class="news-tag">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-pagination
          v-if="filteredNews.length > pageSize"
          background
          layout="prev, pager, next, jumper" {/* Consistent with HomePage */}
          :total="filteredNews.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
          class="news-pagination" {/* Consistent class */}
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getArticles } from '../assets/mockNews.js';
import { ElMessage, ElSkeleton, ElEmpty, ElCard, ElRow, ElCol, ElTag, ElPagination, ElButton } from 'element-plus';

const route = useRoute();

const currentCategoryName = ref('');
const allNews = ref([]); 
const filteredNews = ref([]);
const categoryExists = ref(true); // Assume exists until checked
const loading = ref(true);

const currentPage = ref(1);
const pageSize = ref(6); // Consistent with HomePage's pageSize

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return filteredNews.value.slice(start, end);
});

const filterNewsByCategory = () => {
  loading.value = true;
  currentCategoryName.value = route.params.categoryName;
  
  // TODO: API Call - Fetch articles from /api/news?category=<categoryName>&status=published
  allNews.value = getArticles();

  setTimeout(() => {
    const newsForCategory = allNews.value.filter(
      (news) => news.category === currentCategoryName.value && news.status === 'published'
    );

    const knownCategories = [...new Set(allNews.value.map(item => item.category))];
    if (!knownCategories.includes(currentCategoryName.value)) {
        categoryExists.value = false;
        // ElMessage.error(`分类 '${currentCategoryName.value}' 未找到。`); // Message handled by el-empty
        filteredNews.value = []; 
    } else {
        categoryExists.value = true; // Category name is valid
        if (newsForCategory.length > 0) {
            filteredNews.value = newsForCategory;
        } else {
            filteredNews.value = []; // Category exists but no published articles
        }
    }
    
    currentPage.value = 1; 
    loading.value = false;
  }, 100); 
};

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: document.querySelector('.category-content')?.offsetTop || 0, behavior: 'smooth' });
};

const formatPublishDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Replicated from HomePage for consistency if needed, though category tag is hidden on this page
// const getCategoryTagType = (category) => {
//     const colors = ['', 'success', 'info', 'warning', 'danger'];
//     let hash = 0;
//     if (category) {
//         for (let i = 0; i < category.length; i++) {
//             hash = category.charCodeAt(i) + ((hash << 5) - hash);
//         }
//     }
//     return colors[Math.abs(hash) % colors.length];
// };

onMounted(() => {
  filterNewsByCategory();
});

watch(() => route.params.categoryName, (newCategoryName) => {
  if (newCategoryName) {
    filterNewsByCategory();
  }
});
</script>

<style scoped>
/* General page styling - consistent with HomePage */
.category-page {
  padding: 24px;
  max-width: 1320px;
  margin: 0 auto;
  font-family: var(--font-family-primary);
  background-color: var(--color-background-secondary); /* Page background */
}

.page-title {
  font-size: 2rem; /* H1 style from guide */
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 24px; /* Spacing below title */
  text-align: left; /* Or center if preferred */
  border-bottom: 2px solid var(--color-primary); /* Accent border */
  padding-bottom: 12px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px; /* Ensure it takes some space */
  padding: 20px;
  text-align: center;
}
.empty-state p {
    font-family: var(--font-family-secondary);
    color: var(--color-text-secondary);
    margin-top: 8px;
    margin-bottom: 16px;
}


/* News List Container - consistent with HomePage */
.news-list-container {
  margin-top: 24px;
}

.news-col {
  margin-bottom: 24px;
}

/* News Item Card Styling - REPLICATED FROM HomePage.vue for consistency */
.news-item-card {
  border-radius: 8px;
  background-color: var(--color-background-primary);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.news-item-card:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    transform: translateY(-4px);
}

.news-item-image-placeholder {
  width: 100%;
  height: 180px;
  background-color: var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-placeholder);
  font-size: 0.9rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.news-item-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.news-item-title {
  font-family: var(--font-family-primary);
  font-size: 1.375rem; /* H3 */
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item-summary {
  font-family: var(--font-family-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item-meta {
  display: flex;
  justify-content: flex-end; /* Category tag was removed, so time is aligned to right */
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-placeholder);
  margin-bottom: 12px;
}
.news-item-time {
  font-family: var(--font-family-primary);
}

.news-item-tags .news-tag {
  margin-right: 6px;
  margin-bottom: 6px;
  background-color: var(--color-background-secondary);
  border-color: var(--color-border-subtle);
  color: var(--color-text-secondary);
}
.news-item-tags .news-tag:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

/* Pagination - REPLICATED FROM HomePage.vue for consistency */
.news-pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
:deep(.news-pagination .el-pager li), 
:deep(.news-pagination .btn-prev), 
:deep(.news-pagination .btn-next),
:deep(.news-pagination .el-pagination__jump) {
    font-family: var(--font-family-primary);
}
</style>
