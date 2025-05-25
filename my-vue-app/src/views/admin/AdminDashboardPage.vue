<template>
  <div class="admin-dashboard-page">
    <el-card class="dashboard-card" shadow="never">
      <template #header>
        <div class="card-header-title">
          <el-icon :size="24" style="margin-right: 8px;"><House /></el-icon>
          <h1>后台管理总览</h1>
        </div>
      </template>
      <p class="welcome-message">欢迎来到后台管理系统。请从左侧菜单选择一个模块进行操作。</p>
      
      <el-divider content-position="left">关键指标</el-divider>
      
      <el-row :gutter="24" class="statistics-row">
        <el-col :xs="24" :sm="12" :md="8" class="statistic-col">
          <el-card shadow="hover" class="statistic-card">
            <el-statistic title="总资源数" :value="mockStats.totalResources">
              <template #prefix><el-icon><Files /></el-icon></template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" class="statistic-col">
          <el-card shadow="hover" class="statistic-card">
            <el-statistic title="待处理文章" :value="mockStats.pendingArticles">
              <template #prefix><el-icon><Document /></el-icon></template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" class="statistic-col">
          <el-card shadow="hover" class="statistic-card">
            <el-statistic title="活跃订阅数" :value="mockStats.activeSubscriptions">
              <template #prefix><el-icon><User /></el-icon></template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="left">快速操作</el-divider>
      <div class="quick-actions">
         <el-button type="primary" :icon="Plus" @click="navigateTo('/admin/articles/new')">新建文章</el-button>
         <el-button :icon="Setting" @click="navigateTo('/admin/resources')">管理资源</el-button>
         <el-button :icon="Bell" @click="navigateTo('/admin/briefings')">查看简报</el-button>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElStatistic, ElRow, ElCol, ElIcon, ElDivider, ElButton } from 'element-plus';
import { House, Files, Document, User, Plus, Setting, Bell } from '@element-plus/icons-vue';

const router = useRouter();

// Mock data for statistics - in a real app, this would come from an API
const mockStats = ref({
  totalResources: 1250,
  pendingArticles: 35,
  activeSubscriptions: 2300
});

const navigateTo = (path) => {
    // A simple navigation helper, assuming these routes exist or a more complex logic for new article
    if (path.includes('/new')) {
        // For "new" actions, ideally the target page handles the "new" state.
        // For now, just navigate to the base page or a placeholder.
        router.push(path.split('/new')[0]); 
        // In a real app, you might do: router.push({ name: 'AdminArticleCreate' });
    } else {
        router.push(path);
    }
};

// TODO: API Call - Fetch dashboard statistics on component mount
// onMounted(async () => {
//   const stats = await fetchDashboardStats();
//   mockStats.value = stats;
// });
</script>

<style scoped>
.admin-dashboard-page {
  padding: 24px; /* Consistent page padding */
  font-family: var(--font-family-primary);
}

.dashboard-card {
  /* Uses global .el-card styling from main.css for border-radius and base shadow */
  /* shadow="never" can be used for a flatter look if preferred */
}

.card-header-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem; /* H2 Style */
  font-weight: 700;
  color: var(--color-text-primary);
}
.card-header-title h1 { /* h1 is inside the slot */
    font-size: inherit; /* Inherit size from parent */
    font-weight: inherit;
    color: inherit;
    margin: 0; /* Reset default h1 margin */
}


.welcome-message {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
  line-height: var(--line-height-base);
}

.el-divider {
  margin: 32px 0; /* More spacing for dividers */
  border-color: var(--color-border-subtle);
}
:deep(.el-divider__text) { /* Style Element Plus internal class */
  font-size: 1.125rem; /* H4 Style */
  font-weight: 600;
  color: var(--color-text-primary);
  background-color: var(--color-background-secondary); /* Match page background */
}

.statistics-row {
  margin-top: 20px;
}
.statistic-col {
    margin-bottom: 20px; /* Space for stacking on mobile */
}
.statistic-card {
    text-align: center;
    border: 1px solid var(--color-border-subtle);
    transition: box-shadow 0.3s ease;
}
.statistic-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Enhanced shadow on hover */
}

:deep(.statistic-card .el-statistic__head) { /* Style Element Plus internal class */
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-bottom: 8px;
}
:deep(.statistic-card .el-statistic__content) { /* Style Element Plus internal class */
  font-size: 2.25rem; /* Larger value */
  font-weight: 700;
  color: var(--color-primary);
}
:deep(.statistic-card .el-statistic__prefix .el-icon) {
  font-size: 1.5rem; /* Icon size in statistic */
  color: var(--color-text-placeholder);
  margin-right: 8px;
}

.quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px; /* Spacing between buttons */
    margin-top: 20px;
}
.quick-actions .el-button {
    font-weight: 500; /* Medium weight for button text */
}

</style>
