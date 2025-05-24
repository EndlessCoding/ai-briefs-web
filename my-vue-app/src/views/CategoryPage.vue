<template>
  <div class="category-page">
    <div v-if="!categoryExists && !loading" class="category-not-found">
      <el-empty :description="`分类 '${currentCategoryName}' 不存在或没有相关文章`" />
    </div>
    <div v-else>
      <h1 class="category-title">分类: {{ currentCategoryName }}</h1>
      
      <div v-if="loading" class="loading-spinner">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-if="!loading && filteredNews.length === 0 && categoryExists" class="no-news">
         <el-empty :description="`此分类下暂无文章`" />
      </div>

      <div v-if="!loading && filteredNews.length > 0" class="news-list-container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="newsItem in paginatedNews" :key="newsItem.id" class="news-col">
            <el-card shadow="hover" class="news-card">
              <template #header>
                <div class="card-header">
                  <span>{{ newsItem.title }}</span>
                  <el-tag size="small" type="info" style="float: right;">{{ newsItem.category }}</el-tag>
                </div>
              </template>
              <p class="news-summary">{{ newsItem.summary }}</p>
              <div class="news-meta">
                <time class="news-time">{{ formatPublishDate(newsItem.publishDate) }}</time>
                <div class="news-tags">
                  <el-tag v-for="tag in newsItem.tags" :key="tag" size="small" effect="plain" style="margin-right: 5px;">
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
          layout="prev, pager, next"
          :total="filteredNews.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
          class="pagination-container"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getArticles } from '../assets/mockNews.js'; // Changed import
import { ElMessage, ElSkeleton, ElEmpty } from 'element-plus';

const route = useRoute();

const currentCategoryName = ref('');
const allNews = ref([]); // Initialize as empty array
const filteredNews = ref([]);
const categoryExists = ref(true);
const loading = ref(true);

const currentPage = ref(1);
const pageSize = ref(6); // Number of news items per page

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return filteredNews.value.slice(start, end);
});

const filterNewsByCategory = () => {
  loading.value = true;
  currentCategoryName.value = route.params.categoryName;
  
  // TODO: API Call - Fetch articles from /api/news?category=<categoryName>&status=published
  // The getArticles() function currently simulates fetching all, then we filter.
  // A real API would likely handle category and status filtering.
  allNews.value = getArticles();

  // Simulate async data fetching if needed, or directly filter
  setTimeout(() => { // Simulating a small delay for UI feedback
    const newsForCategory = allNews.value.filter(
      (news) => news.category === currentCategoryName.value && news.status === 'published' // Also ensure only published news on category pages
    );

    if (newsForCategory.length > 0) {
      filteredNews.value = newsForCategory;
      categoryExists.value = true;
    } else {
      // Check if category itself is valid by seeing if any news item *could* belong to it (published or not)
      const knownCategories = [...new Set(allNews.value.map(item => item.category))];
      if (!knownCategories.includes(currentCategoryName.value)) {
          categoryExists.value = false;
          ElMessage.error(`分类 '${currentCategoryName.value}' 未找到。`);
          filteredNews.value = []; 
      } else {
          categoryExists.value = true; // Category is valid, but no published articles
          filteredNews.value = []; // Ensure it's empty
          // Optionally, inform the user if the category exists but has no published articles
          // ElMessage.info(`分类 '${currentCategoryName.value}' 下暂无已发布的文章。`);
      }
    }
    currentPage.value = 1; // Reset to first page
    loading.value = false;
  }, 100); // Shortened delay
};

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatPublishDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};

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
.category-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-title {
  font-size: 1.8em;
  margin-bottom: 25px;
  color: #303133;
  text-align: center;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 10px;
}

.category-not-found, .no-news {
  text-align: center;
  margin-top: 50px;
  color: #606266;
}

.loading-spinner {
  padding: 20px;
}

.news-list-container {
  margin-top: 20px;
}

.news-col {
  margin-bottom: 20px;
}

.news-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.news-summary {
  font-size: 0.9em;
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.6;
  flex-grow: 1;
}

.news-meta {
  font-size: 0.8em;
  color: #909399;
}

.news-time {
  display: block;
  margin-bottom: 8px;
}

.news-tags .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
