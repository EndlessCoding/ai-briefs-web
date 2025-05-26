<template>
  <el-container class="main-layout">
    <el-header class="main-header">
      <div class="header-container">
        <div class="logo-container">
          <router-link to="/" class="logo-link">
            <img :src="logoUrl" alt="MyNewsAggregator Logo" class="logo-image" />
            <span>MyNewsAggregator</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <el-menu mode="horizontal" :ellipsis="false" @select="handleMenuSelect" :default-active="activeMenu" :router="false">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="财经">财经</el-menu-item>
            <el-menu-item index="房产">房产</el-menu-item>
            <el-menu-item index="科技">科技</el-menu-item>
          </el-menu>
        </nav>

        <div class="user-actions-container">
          <template v-if="authStore.isLoggedIn">
            <el-dropdown @command="handleUserCommand" trigger="click">
              <span class="el-dropdown-link user-profile-link">
                <el-avatar :size="32" :src="authStore.avatarUrl" class="user-avatar"></el-avatar>
                <span class="username-greeting">欢迎, {{ authStore.username }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" :icon="User">个人主页</el-dropdown-item>
                  <el-dropdown-item command="admin" :icon="Setting" v-if="isUserAdmin">后台管理</el-dropdown-item>
                  <el-dropdown-item command="logout" divided :icon="SwitchButton">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
            <el-button text @click="handleRegister" class="register-button">注册</el-button>
          </template>
        </div>

        <!-- Mobile Navigation Trigger -->
        <div class="mobile-nav-trigger">
          <el-icon @click="mobileDrawerVisible = true" :size="24"><Menu /></el-icon>
        </div>
      </div>
    </el-header>

    <!-- Mobile Drawer Navigation -->
    <el-drawer v-model="mobileDrawerVisible" title="导航" direction="ltr" :with-header="true" size="75%">
      <el-menu @select="handleMobileMenuSelect" :default-active="activeMenu" :router="false">
        <el-menu-item index="home" @click="closeMobileDrawer">首页</el-menu-item>
        <el-menu-item index="财经" @click="closeMobileDrawer">财经</el-menu-item>
        <el-menu-item index="房产" @click="closeMobileDrawer">房产</el-menu-item>
        <el-menu-item index="科技" @click="closeMobileDrawer">科技</el-menu-item>
      </el-menu>
    </el-drawer>

    <el-main class="main-content">
      <router-view />
    </el-main>

    <el-footer class="main-footer">
      <p>&copy; {{ new Date().getFullYear() }} MyNewsAggregator. All rights reserved.</p>
      <p>
        <router-link to="/about">关于我们</router-link> | 
        <router-link to="/privacy">隐私政策</router-link> | 
        <router-link to="/terms">服务条款</router-link>
      </p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElDrawer, ElButton } from 'element-plus';
import { Menu, ArrowDown, User, Setting, SwitchButton } from '@element-plus/icons-vue';
import { authStore } from '../../store/auth';
import logoUrl from '@/assets/logo.svg'; // Correctly import the logo

const router = useRouter();
const route = useRoute();

const mobileDrawerVisible = ref(false);

// TODO: Implement admin role check for the "后台管理" link
const isUserAdmin = computed(() => {
  // For now, assume any logged-in user might be admin for testing, or tie to a specific username
  return authStore.isLoggedIn; // Replace with actual role check from authStore or user profile
});

const activeMenu = computed(() => {
  if (route.name === 'Category') {
    return route.params.categoryName;
  }
  if (route.name === 'Home' || route.path === '/') {
    return 'home';
  }
  return route.name || 'home'; // Fallback
});

const navigateTo = (pathName, params = {}) => {
  if (pathName === 'home') {
    router.push('/');
  } else {
    router.push({ name: 'Category', params: { categoryName: pathName } });
  }
  ElMessage.info(`导航到: ${pathName === 'home' ? '首页' : pathName}`);
};

const handleMenuSelect = (index) => {
  navigateTo(index);
};

const handleMobileMenuSelect = (index) => {
  navigateTo(index);
  mobileDrawerVisible.value = false; // Close drawer after selection
};

const closeMobileDrawer = () => {
    mobileDrawerVisible.value = false;
}

const handleUserCommand = (command) => {
  if (command === 'profile') {
    router.push({ name: 'Profile' });
  } else if (command === 'admin') {
    router.push('/admin'); // Navigate to admin area
  } else if (command === 'logout') {
    // TODO: API Call - Send logout request to /api/logout
    authStore.logout(); 
    ElMessage.info('已退出登录');
    router.push('/'); 
  }
};

const handleLogin = () => {
  // TODO: API Call - Send login credentials to /api/login
  authStore.login(); 
  ElMessage.success('登录成功 (模拟)');
};

const handleRegister = () => {
  // TODO: API Call - Navigate to a registration page
  ElMessage.info('导航到注册页面 (占位)');
  // router.push({ name: 'RegisterPage' }); 
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-secondary); /* Light gray for overall page background */
}

.main-header {
  background-color: var(--color-background-primary); /* White header */
  padding: 0 24px; /* Consistent padding */
  height: 64px; /* Standard header height */
  border-bottom: 1px solid var(--color-border-standard);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  display: flex; /* Needed for ElHeader to respect children flex */
  align-items: center; /* Vertically center content in header */
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: 1.5rem; /* 24px */
  font-weight: 700; /* Bold */
  font-family: var(--font-family-primary);
}

.logo-image {
  height: 32px; /* Adjust as needed */
  margin-right: 12px;
}

.desktop-nav {
  display: none; /* Hidden by default, shown via media query */
}

.desktop-nav .el-menu--horizontal {
  border-bottom: none; /* Remove default border from Element Plus menu */
  height: 63px; /* Align with header height, considering border */
}

.desktop-nav .el-menu--horizontal > .el-menu-item {
  font-family: var(--font-family-primary);
  font-size: 1rem; /* 16px */
  font-weight: 500; /* Medium */
  color: var(--color-text-secondary);
  padding: 0 20px;
  height: 63px;
  line-height: 63px;
  border-bottom: 2px solid transparent; /* Placeholder for active indicator */
  transition: color 0.2s ease, border-color 0.2s ease;
}

.desktop-nav .el-menu--horizontal > .el-menu-item:hover {
  color: var(--color-primary);
  background-color: transparent; /* No background on hover for cleaner look */
}

.desktop-nav .el-menu--horizontal > .el-menu-item.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background-color: transparent;
}


.user-actions-container {
  display: flex;
  align-items: center;
  gap: 12px; /* Spacing between login/register or user dropdown */
}

.user-profile-link {
  cursor: pointer;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  font-family: var(--font-family-primary);
}
.user-profile-link:hover .username-greeting {
    color: var(--color-primary);
}


.user-avatar {
  margin-right: 8px;
  background-color: var(--color-border-subtle); /* Placeholder bg for avatar */
}
.username-greeting {
    font-weight: 500;
    font-size: 0.9rem;
}

.login-button.el-button {
    font-weight: 500;
}
.register-button.el-button--text {
    color: var(--color-text-secondary);
    font-weight: 500;
}
.register-button.el-button--text:hover {
    color: var(--color-primary);
}


.mobile-nav-trigger {
  display: flex; /* Shown by default, hidden via media query */
  align-items: center;
  cursor: pointer;
  color: var(--color-text-primary);
}

/* Drawer Menu Styling */
:deep(.el-drawer__header) { /* Using :deep to target Element Plus internal classes */
  margin-bottom: 0; /* Remove default margin */
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-standard);
}
:deep(.el-drawer__title) {
  font-family: var(--font-family-primary);
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  color: var(--color-text-primary);
}
.el-drawer .el-menu {
    border-right: none;
}
.el-drawer .el-menu-item {
    font-family: var(--font-family-primary);
    font-size: 1.1rem;
    padding: 12px 20px !important;
    color: var(--color-text-secondary);
}
.el-drawer .el-menu-item:hover {
    color: var(--color-primary);
    background-color: var(--color-background-secondary);
}
.el-drawer .el-menu-item.is-active {
    color: var(--color-primary);
    font-weight: 600;
}


.main-content {
  flex-grow: 1; /* Ensure content area takes up available space */
  padding: 24px; /* Consistent padding around content */
  background-color: var(--color-background-secondary);
}

.main-footer {
  background-color: var(--color-background-primary);
  color: var(--color-text-secondary);
  padding: 20px 24px;
  text-align: center;
  font-size: 0.875rem; /* 14px */
  border-top: 1px solid var(--color-border-standard);
  margin-top: auto; /* Push footer to bottom if content is short */
}

.main-footer p {
  margin: 5px 0;
}

.main-footer a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.main-footer a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Responsive adjustments */
@media (min-width: 768px) { /* Tablet and above */
  .desktop-nav {
    display: flex;
    justify-content: center; /* Center nav items */
    flex-grow: 1; /* Allow nav to take space */
    margin: 0 20px; /* Space around nav */
  }
  .mobile-nav-trigger {
    display: none; /* Hide hamburger on larger screens */
  }
}

@media (max-width: 767px) { /* Mobile specific */
  .main-header {
    padding: 0 16px; /* Reduced padding for mobile header */
  }
  .logo-link span {
    font-size: 1.25rem; /* Smaller logo text on mobile */
  }
  .logo-image {
    height: 28px;
  }
  .user-actions-container {
    /* Hide full user actions on mobile if too crowded, rely on drawer or simpler display */
    /* Or adjust spacing */
    gap: 8px;
  }
  .username-greeting {
      display: none; /* Hide username text on mobile for space, avatar is enough */
  }
  .login-button {
      padding: 8px 12px; /* Smaller login button */
  }
}
</style>
