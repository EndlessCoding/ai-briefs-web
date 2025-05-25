<template>
  <div class="home-page">
    <!-- 1. Project Introduction -->
    <section class="intro-section section-spacing">
      <el-card class="intro-card" shadow="never"> <!-- Subtle shadow from global or none -->
        <template #header>
          <h1 class="intro-title">{{ translations.title }}</h1>
        </template>
        <p class="intro-subtitle">{{ translations.subtitle }}</p>
        <p class="intro-value-prop">{{ translations.value_prop }}</p>
        
        <el-collapse v-if="translations.how_it_works_title" class="intro-collapse" v-model="activeCollapseNames">
          <el-collapse-item :title="translations.how_it_works_title" name="how" class="collapse-item-title">
            <ul class="feature-list">
              <li v-for="(step, index) in translations.how_it_works_steps" :key="`how-${index}`">{{ step }}</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item :title="translations.why_i_built_it_title" name="why" class="collapse-item-title">
            <p>{{ translations.why_i_built_it_p1 }}</p>
            <p>{{ translations.why_i_built_it_p2 }}</p>
          </el-collapse-item>
        </el-collapse>
        <p class="intro-tailored">{{ translations.tailored_for_me }}</p>
        <p class="intro-final-statement">{{ translations.final_statement }}</p>
      </el-card>
    </section>

    <!-- 2. Email Subscription -->
    <section class="subscription-section section-spacing">
      <el-card class="subscription-card-content" shadow="hover">
        <h2 class="subscription-title">订阅我们的新闻简报</h2>
        <p class="subscription-tagline">获取最新资讯，直接发送到您的邮箱。</p>
        <el-input
          v-model="email"
          placeholder="请输入您的邮箱地址"
          :disabled="isSubscribed"
          class="subscription-input"
          size="large"
        >
          <template #append>
            <el-button 
              type="primary" 
              @click="subscribeEmail" 
              :disabled="isSubscribed" 
              class="subscribe-button"
              size="large"
            >
              {{ isSubscribed ? '已订阅' : '立即订阅' }}
            </el-button>
          </template>
        </el-input>
      </el-card>
    </section>

    <!-- 3. News Display Section -->
    <section class="news-feed-section section-spacing">
      <h2 class="section-title">最新资讯</h2>
      <el-row :gutter="24"> {/* Increased gutter for more space */}
        <el-col :xs="24" :sm="12" :md="8" v-for="newsItem in newsList" :key="newsItem.id" class="news-col">
          <el-card class="news-item-card" shadow="hover">
            <div class="news-item-image-placeholder">
              <!-- Placeholder for image, e.g., <img :src="newsItem.imageUrl" /> or a div with background -->
              <span>图像占位</span>
            </div>
            <div class="news-item-content">
              <h3 class="news-item-title">{{ newsItem.title }}</h3>
              <p class="news-item-summary">{{ newsItem.summary }}</p>
              <div class="news-item-meta">
                <span class="news-item-category">
                  <el-tag size="small" effect="light" :type="getCategoryTagType(newsItem.category)">
                    {{ newsItem.category }}
                  </el-tag>
                </span>
                <time class-="news-item-time">{{ formatPublishDate(newsItem.publishDate) }}</time>
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
        v-if="totalNews > pageSize" {/* Show pagination only if more than one page */}
        background
        layout="prev, pager, next, jumper"
        :total="totalNews"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        class="news-pagination"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElCollapse, ElCollapseItem, ElCard, ElInput, ElButton, ElRow, ElCol, ElTag, ElPagination } from 'element-plus';
import { getNewsPage } from '../assets/mockNews.js';
import translationsData from '../locales/zh.json';

const translations = ref(translationsData);
const activeCollapseNames = ref(['how', 'why']); // Keep them open by default

const email = ref('');
const isSubscribed = ref(false);

const isValidEmail = (emailStr) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);

const subscribeEmail = () => {
  if (!isValidEmail(email.value)) {
    ElMessage.error('请输入有效的邮箱地址！');
    return;
  }
  // TODO: API Call - Submit email to /api/subscribe
  isSubscribed.value = true;
  ElMessage.success(`感谢订阅：${email.value}`);
};

const newsList = ref([]);
const currentPage = ref(1);
const pageSize = ref(6); // Increased items per page for better grid
const totalNews = ref(0);

const loadNews = () => {
  // TODO: API Call - Fetch paginated news from /api/news?page=<currentPage>&limit=<pageSize>
  const data = getNewsPage(currentPage.value, pageSize.value);
  newsList.value = data.news;
  totalNews.value = data.total;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadNews();
  window.scrollTo({ top: document.querySelector('.news-feed-section')?.offsetTop || 0, behavior: 'smooth' });
};

const formatPublishDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getCategoryTagType = (category) => {
    const colors = ['', 'success', 'info', 'warning', 'danger'];
    let hash = 0;
    if (category) {
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    return colors[Math.abs(hash) % colors.length];
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.home-page {
  padding: 24px; /* Consistent padding from style guide */
  max-width: 1320px; /* Max container width from main.css examples */
  margin: 0 auto;
  font-family: var(--font-family-primary);
}

.section-spacing {
  margin-bottom: 48px; /* Generous spacing between sections */
}

/* Introduction Section */
.intro-card {
  background-color: var(--color-background-primary);
  border: 1px solid var(--color-border-subtle); /* Softer border for intro */
}
.intro-title {
  font-size: 2rem; /* H1 from style guide */
  color: var(--color-text-primary);
  font-weight: 700;
  margin-bottom: 16px;
}
.intro-subtitle, .intro-value-prop, .intro-tailored, .intro-final-statement, .intro-collapse p, .feature-list li {
  font-family: var(--font-family-secondary); /* Lora for content text */
  font-size: 1.1rem; /* Slightly larger for readability */
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}
.intro-final-statement {
  font-style: italic;
  color: var(--color-text-placeholder);
}
.intro-collapse {
  margin-top: 24px;
  margin-bottom: 24px;
}
:deep(.intro-collapse .el-collapse-item__header) { /* Style Element Plus internal classes */
  font-size: 1.25rem; /* H4 style */
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--color-text-primary);
}
.feature-list {
  list-style-type: disc;
  padding-left: 24px;
}

/* Subscription Section */
.subscription-section {
  text-align: center;
  padding: 32px;
  background-color: var(--color-background-primary);
  border-radius: 8px; /* Style guide card radius */
  border: 1px solid var(--color-border-subtle);
}
.subscription-title {
  font-size: 1.75rem; /* H2 from style guide */
  color: var(--color-text-primary);
  font-weight: 700;
  margin-bottom: 8px;
}
.subscription-tagline {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}
.subscription-input {
  max-width: 500px;
  margin: 0 auto;
}
.subscription-input .el-input__inner { /* Targeting inner input for specific styles if needed */
  font-family: var(--font-family-primary);
}
.subscribe-button.el-button--primary {
  /* Styles for primary button are largely from global main.css via --el-color-primary */
  font-weight: 500; /* Medium weight from style guide */
}

/* News Display Section */
.news-feed-section .section-title {
  font-size: 1.75rem; /* H2 from style guide */
  color: var(--color-text-primary);
  font-weight: 700;
  margin-bottom: 24px;
  text-align: left;
}

.news-col {
  margin-bottom: 24px; /* Gutter is horizontal, this is for vertical */
}

.news-item-card {
  border-radius: 8px; /* Style guide */
  background-color: var(--color-background-primary);
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure cards in a row are same height */
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.news-item-card:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.1); /* Enhanced shadow on hover */
    transform: translateY(-4px);
}

.news-item-image-placeholder {
  width: 100%;
  height: 180px; /* Fixed height for image placeholder */
  background-color: var(--color-border-subtle); /* Placeholder color */
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
  font-size: 1.375rem; /* H3 from style guide */
  font-weight: 600; /* Semi-bold */
  color: var(--color-text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
  /* Clamp to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item-summary {
  font-family: var(--font-family-secondary); /* Lora for article text */
  font-size: 0.95rem; /* Slightly smaller than main body */
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  flex-grow: 1;
  /* Clamp to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem; /* Metadata size from style guide */
  color: var(--color-text-placeholder);
  margin-bottom: 12px;
}
.news-item-category .el-tag {
  font-weight: 500;
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

.news-pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
/* Ensure pagination buttons use primary font if not inherited */
:deep(.news-pagination .el-pager li), 
:deep(.news-pagination .btn-prev), 
:deep(.news-pagination .btn-next),
:deep(.news-pagination .el-pagination__jump) {
    font-family: var(--font-family-primary);
}
</style>
