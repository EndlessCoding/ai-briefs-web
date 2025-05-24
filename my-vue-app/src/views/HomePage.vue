<template>
  <div class="home-page">
    <!-- 1. Project Introduction -->
    <el-card shadow="never" class="introduction-card">
      <template #header>
        <div class="card-header">
          <span>{{ translations.title }}</span>
        </div>
      </template>
      <p>{{ translations.subtitle }}</p>
      <p>{{ translations.value_prop }}</p>
      
      <el-collapse v-if="translations.how_it_works_title" style="margin-top: 20px;">
        <el-collapse-item :title="translations.how_it_works_title" name="1">
          <ul>
            <li v-for="(step, index) in translations.how_it_works_steps" :key="index">{{ step }}</li>
          </ul>
        </el-collapse-item>
        <el-collapse-item :title="translations.why_i_built_it_title" name="2">
          <p>{{ translations.why_i_built_it_p1 }}</p>
          <p>{{ translations.why_i_built_it_p2 }}</p>
        </el-collapse-item>
      </el-collapse>
       <p style="margin-top: 15px;">{{ translations.tailored_for_me }}</p>
       <p style="margin-top: 5px; font-style: italic;">{{ translations.final_statement }}</p>
    </el-card>

    <!-- 2. Email Subscription -->
    <el-card shadow="hover" class="subscription-card">
      <template #header>
        <div class="card-header">
          <span>订阅我们的新闻简报</span>
        </div>
      </template>
      <el-input
        v-model="email"
        placeholder="请输入您的邮箱"
        :disabled="isSubscribed"
        class="subscription-input"
      >
        <template #append>
          <el-button @click="subscribeEmail" :disabled="isSubscribed">
            {{ isSubscribed ? '已订阅' : '订阅' }}
          </el-button>
        </template>
      </el-input>
    </el-card>

    <!-- 3. News Display Section -->
    <div class="news-section">
      <h2>最新资讯</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="newsItem in newsList" :key="newsItem.id" class="news-col">
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
            <!-- Optional: Read more button or link to full content -->
            <!-- <el-button type="text" @click="readMore(newsItem)">阅读全文</el-button> -->
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        v-if="totalNews > 0"
        background
        layout="prev, pager, next"
        :total="totalNews"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        class="pagination-container"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElCollapse, ElCollapseItem } from 'element-plus';
import { getNewsPage } from '../assets/mockNews.js';
import translationsData from '../locales/zh.json'; // Direct import

// 1. Project Introduction
const translations = ref(translationsData);

// 2. Email Subscription
const email = ref('');
const isSubscribed = ref(false);

const isValidEmail = (emailStr) => {
  // Basic email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
};

const subscribeEmail = () => {
  if (!isValidEmail(email.value)) {
    ElMessage.error('请输入有效的邮箱地址！');
    return;
  }
  // TODO: API Call - Submit email to /api/subscribe
  // Mock subscription - in a real app, this would involve an API call
  isSubscribed.value = true;
  ElMessage.success(`感谢订阅：${email.value}`);
};

// 3. News Display
const newsList = ref([]);
const currentPage = ref(1);
const pageSize = ref(3); // Show 3 news items per page
const totalNews = ref(0);

const loadNews = () => {
  // TODO: API Call - Fetch paginated news from /api/news?page=<currentPage>&limit=<pageSize>
  // The getNewsPage function currently simulates this.
  const data = getNewsPage(currentPage.value, pageSize.value);
  newsList.value = data.news;
  totalNews.value = data.total;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadNews();
};

const formatPublishDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};

// const readMore = (newsItem) => {
//   // Navigate to a detailed news page, e.g., router.push({ name: 'NewsDetail', params: { id: newsItem.id } });
//   ElMessage.info(`阅读更多: ${newsItem.title} (占位)`);
// };

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.introduction-card, .subscription-card, .news-section {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
}

.introduction-card ul {
  padding-left: 20px;
}
.introduction-card li {
  margin-bottom: 8px;
}

.subscription-input {
  margin-top: 10px;
}

.news-section h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #303133; /* Element Plus text color */
}

.news-col {
  margin-bottom: 20px; /* Space between rows of cards on smaller screens */
}

.news-card {
  height: 100%; /* Make cards in a row the same height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-summary {
  font-size: 0.9em;
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.6;
  flex-grow: 1; /* Allow summary to take available space */
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
  margin-bottom: 5px; /* Handle wrapping */
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
