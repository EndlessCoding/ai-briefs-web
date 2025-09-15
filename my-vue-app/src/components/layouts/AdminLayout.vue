<template>
  <el-container class="admin-layout">
    <el-aside :width="isSidebarCollapsed ? '65px' : '220px'" class="admin-sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo-link" v-if="!isSidebarCollapsed">
            <img src="/logo.svg" alt="Logo" class="sidebar-logo-img" />
            <span>MyNewsAdmin</span>
        </router-link>
        <span v-else class="sidebar-logo-link-collapsed">
             <img src="/logo.svg" alt="Logo" class="sidebar-logo-img" />
        </span>
        <el-icon @click="toggleSidebar" class="collapse-icon" :size="20">
            <Fold v-if="!isSidebarCollapsed" />
            <Expand v-else />
        </el-icon>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        :collapse="isSidebarCollapsed"
        :collapse-transition="false"
        router
        unique-opened
        :background-color="'var(--color-background-dark)'"
        :text-color="'var(--color-text-on-dark)'"
        :active-text-color="'var(--color-primary)'"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><House /></el-icon>
          <template #title>总览</template>
        </el-menu-item>
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
        <el-divider class="menu-divider" />
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>返回主站</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="admin-main-container">
      <el-header class="admin-header">
        <div class="header-left">
            <el-icon @click="toggleSidebar" class="mobile-collapse-icon" :size="22">
                <Expand v-if="isSidebarCollapsed" />
                <Fold v-else />
            </el-icon>
            <span class="current-module-title">当前模块: {{ currentModuleTitle }}</span>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleUserCommand" trigger="click">
              <span class="el-dropdown-link user-profile-link">
                <el-avatar :size="32" :src="authStore.avatarUrl" class="user-avatar"></el-avatar>
                <span class="admin-username">{{ authStore.username }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" :icon="UserIcon">个人主页</el-dropdown-item>
                  <el-dropdown-item command="logout" divided :icon="SwitchButton">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
        </div>
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
import { ElMessage, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import {
  House, Files, Document, DataAnalysis, User, Memo, Fold, Expand, HomeFilled, ArrowDown,
  User as UserIcon, Setting, SwitchButton // Setting might be for future use
} from '@element-plus/icons-vue';
import { authStore } from '../../store/auth'; // Assuming authStore is also used for admin user info

const route = useRoute();
const router = useRouter();

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const activeMenu = computed(() => {
  return route.path;
});

const currentModuleTitle = computed(() => {
  if (route.meta && route.meta.title) {
    return route.meta.title;
  }
  const pathParts = route.path.split('/');
  const lastPart = pathParts[pathParts.length -1];
  const title = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  return title || 'Dashboard'; // Fallback if no title found
});

const handleUserCommand = (command) => {
  if (command === 'profile') {
    router.push({ name: 'Profile' }); // Ensure 'Profile' route exists for user profile
  } else if (command === 'logout') {
    authStore.logout();
    ElMessage.info('已退出登录');
    router.push('/'); // Redirect to homepage or login page
  }
};
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background-color: var(--color-background-secondary); /* Consistent with main.css */
}

.admin-sidebar {
  background-color: var(--color-background-dark);
  color: var(--color-text-on-dark);
  transition: width 0.28s ease-in-out;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 60px; /* Standard header height */
  line-height: 60px;
  font-size: 1.1rem; /* Slightly smaller than main logo */
  font-weight: 600;
  color: #fff; /* White text for logo */
  background-color: #263445; /* Slightly different shade for logo background */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Pushes icon to the right */
  padding: 0 15px; /* Adjusted padding */
  flex-shrink: 0; /* Prevent header from shrinking */
}
.sidebar-logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
}
.sidebar-logo-link-collapsed {
    display: flex;
    align-items: center;
    justify-content: center; /* Center logo when collapsed */
    width: 100%;
}
.sidebar-logo-img {
    height: 28px; /* Adjust as needed */
    margin-right: 10px;
}
.sidebar-logo-link-collapsed .sidebar-logo-img {
    margin-right: 0;
}

.collapse-icon {
  cursor: pointer;
  color: #fff; /* White icon */
  padding: 5px; /* Make it easier to click */
}
.collapse-icon:hover {
    background-color: rgba(255,255,255,0.1);
    border-radius: 4px;
}


.admin-menu {
  flex-grow: 1; /* Allow menu to fill remaining space */
  border-right: none;
  font-family: var(--font-family-primary);
}

.admin-menu:not(.el-menu--collapse) {
  width: 100%;
}

.admin-menu .el-menu-item {
  font-weight: 500;
  height: 50px; /* Slightly reduced height for more items */
  line-height: 50px;
  padding-left: 20px !important; /* Ensure consistent padding */
}
.admin-menu .el-menu-item:hover {
  background-color: #263445 !important; /* Darker hover */
}
.admin-menu .el-menu-item.is-active {
  background-color: var(--color-primary) !important; /* Primary blue for active */
  color: #fff !important; /* White text for active */
}
.admin-menu .el-menu-item.is-active .el-icon {
  color: #fff !important; /* White icon for active */
}
.menu-divider {
    margin: 10px 15px;
    background-color: rgba(255,255,255,0.1);
}


.admin-main-container {
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Subtle shadow */
  border-bottom: 1px solid var(--color-border-standard);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
    display: flex;
    align-items: center;
}
.mobile-collapse-icon {
    display: none; /* Hidden on desktop */
    cursor: pointer;
    margin-right: 15px;
    color: var(--color-text-primary);
}
.current-module-title {
    font-size: 1.1rem;
    font-weight: 500;
}

.header-right .user-profile-link {
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    cursor: pointer;
}
.header-right .user-avatar {
    margin-right: 8px;
}
.header-right .admin-username {
    font-weight: 500;
    font-size: 0.9rem;
}


.admin-content {
  padding: 20px; /* Consistent padding */
  background-color: var(--color-background-secondary);
  flex-grow: 1;
  overflow-y: auto;
}

/* Router view transition (same as before, generally good) */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(15px);
}

/* Responsive adjustments for Admin Layout */
@media (max-width: 768px) {
  .admin-sidebar {
    /* For smaller screens, you might want the sidebar to be fully collapsed by default or use an off-canvas approach */
    /* This example keeps it collapsible but you might trigger collapse programmatically */
  }
  .sidebar-header span { /* Hide text in header when sidebar is narrow */
    display: v-bind("isSidebarCollapsed ? 'none' : 'flex'");
  }
  .sidebar-header .collapse-icon {
      display: none; /* Hide desktop collapse icon on mobile */
  }
  .mobile-collapse-icon {
      display: inline-flex; /* Show mobile collapse icon */
  }
  .admin-header {
      padding: 0 15px;
  }
}

</style>
