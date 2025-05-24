<template>
  <el-container class="admin-layout">
    <el-aside :width="isSidebarCollapsed ? '64px' : '220px'" class="admin-sidebar">
      <div class="sidebar-header">
        <span v-if="!isSidebarCollapsed">后台管理</span>
        <el-icon @click="toggleSidebar" class="collapse-icon"><Fold /></el-icon>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        :collapse="isSidebarCollapsed"
        :collapse-transition="false"
        router
        unique-opened
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/resources">
          <el-icon><Files /></el-icon>
          <template #title>资源管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <template #title>文章管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/briefings">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>简报管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/subscriptions">
          <el-icon><User /></el-icon>
          <template #title>订阅管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/logs">
          <el-icon><Memo /></el-icon>
          <template #title>访问日志</template>
        </el-menu-item>
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>返回主站</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="admin-main-container">
      <el-header class="admin-header">
        <div>当前模块: {{ currentModuleTitle }}</div>
        <!-- Add breadcrumbs or other header content here -->
      </el-header>
      <el-main class="admin-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Files, Document, DataAnalysis, User, Memo, Fold, HomeFilled
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter(); // eslint-disable-line no-unused-vars

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const activeMenu = computed(() => {
  // Highlights the menu item based on the current route
  return route.path;
});

const currentModuleTitle = computed(() => {
  // Extracts title from route meta or generates from path
  if (route.meta && route.meta.title) {
    return route.meta.title;
  }
  // Fallback for non-meta titles, can be improved
  const pathParts = route.path.split('/');
  const lastPart = pathParts[pathParts.length -1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1) || 'Dashboard';
});

</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background-color: #f0f2f5;
}

.admin-sidebar {
  background-color: #304156; /* Dark sidebar */
  color: #bfcbd9;
  transition: width 0.28s;
  overflow-x: hidden; /* Prevent horizontal scrollbar when collapsing */
}

.sidebar-header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #2b3a4a; /* Slightly darker header for sidebar */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.sidebar-header .collapse-icon {
  cursor: pointer;
  font-size: 20px;
}
.sidebar-header span {
   overflow: hidden;
   white-space: nowrap;
}


.admin-menu:not(.el-menu--collapse) {
  width: 100%; /* Ensure menu takes full width of expanded sidebar */
}
.admin-menu {
  border-right: none; /* Remove default border */
}

/* Override Element Plus menu item styles for better contrast/fit */
.admin-menu .el-menu-item {
  color: #bfcbd9;
}
.admin-menu .el-menu-item:hover {
  background-color: #263445 !important; /* Hover color */
}
.admin-menu .el-menu-item.is-active {
  color: #409EFF !important; /* Active text color (Element Plus primary) */
  background-color: #263445 !important; /* Active background color */
}
.admin-menu .el-menu-item .el-icon {
  color: #bfcbd9; /* Icon color */
}
.admin-menu .el-menu-item.is-active .el-icon {
  color: #409EFF; /* Active icon color */
}


.admin-main-container {
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-content {
  padding: 20px;
  background-color: #f0f2f5;
  flex-grow: 1; /* Ensure it takes available space */
  overflow-y: auto; /* Scroll content if it overflows */
}

/* Router view transition */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
