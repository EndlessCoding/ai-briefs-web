<template>
  <el-container class="main-layout">
    <el-header class="main-header">
      <el-row justify="space-between" align="middle" style="height: 100%;">
        <el-col :span="4">
          <div class="logo">MyNewsAggregator</div>
        </el-col>
        <el-col :xs="0" :sm="14"> <!-- Hide menu on extra small screens, show on sm and up -->
          <el-menu mode="horizontal" :ellipsis="false" @select="handleMenuSelect" :router="false">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="财经">财经</el-menu-item>
            <el-menu-item index="房产">房产</el-menu-item>
            <el-menu-item index="科技">科技</el-menu-item>
            <!-- Add more menu items here -->
          </el-menu>
        </el-col>
        <el-col :xs="20" :sm="0"> <!-- Hamburger for extra small screens -->
          <el-dropdown @command="handleMenuCommand">
            <span class="el-dropdown-link">
              <el-icon style="font-size: 24px; color: white;"><Menu /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="财经">财经</el-dropdown-item>
                <el-dropdown-item command="房产">房产</el-dropdown-item>
                <el-dropdown-item command="科技">科技</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
        <el-col :span="6">
          <div class="user-actions">
            <template v-if="authStore.isLoggedIn">
              <el-dropdown @command="handleUserCommand">
                <span class="el-dropdown-link user-profile-link">
                  <el-avatar :size="30" :src="authStore.avatarUrl" style="margin-right: 8px;"></el-avatar>
                  欢迎, {{ authStore.username }}
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人主页</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button type="text" @click="handleLogin">登录</el-button>
              <el-button type="text" @click="handleRegister">注册</el-button>
            </template>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ElMessage, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus';
import { Menu, ArrowDown } from '@element-plus/icons-vue'; // Import Menu and ArrowDown icons
import { authStore } from '../../store/auth'; // Import the auth store

const router = useRouter();

const handleMenuSelect = (index) => {
  ElMessage(`导航到: ${index}`);
  if (index === 'home') {
    router.push('/');
  } else {
    // Index is the category name e.g., '财经', '房产', '科技'
    router.push({ name: 'Category', params: { categoryName: index } });
  }
};

const handleMenuCommand = (command) => {
  ElMessage(`导航到: ${command}`);
  if (command === 'home') {
    router.push('/');
  } else {
    // Command is the category name
    router.push({ name: 'Category', params: { categoryName: command } });
  }
};

const handleUserCommand = (command) => {
  if (command === 'profile') {
    router.push({ name: 'Profile' }); // Assuming 'Profile' is the name of the profile route
  } else if (command === 'logout') {
    // TODO: API Call - Send logout request to /api/logout
    authStore.logout(); // This updates the local auth state
    ElMessage.info('已退出登录');
    router.push('/'); // Redirect to home page after logout
  }
};

const handleLogin = () => {
  // TODO: API Call - Send login credentials to /api/login
  // On success, the API would return user data and a token.
  // authStore.login() would then be called with actual user data.
  // For now, it's a mock:
  authStore.login(); 
  ElMessage.success('登录成功 (模拟)');
};

const handleRegister = () => {
  // TODO: API Call - Navigate to a registration page or show a registration modal
  // The registration page/modal would then handle form submission to /api/register
  ElMessage.info('导航到注册页面 (占位)');
  // router.push({ name: 'RegisterPage' }); // Assuming a RegisterPage route
};
</script>

<style scoped>
.user-profile-link {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
}

.main-layout {
  min-height: 100vh;
}

.main-header {
  background-color: #409EFF; /* Element Plus primary color */
  color: white;
  padding: 0 20px;
  height: 60px;
  line-height: 60px; /* Vertically center content */
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.user-actions {
  text-align: right;
}

.user-actions .el-button--text {
  color: white;
}

.user-actions span {
  margin-right: 10px;
  color: white;
}

.main-content {
  padding: 20px;
}

/* Responsive adjustments for menu */
.el-menu--horizontal {
  border-bottom: none; /* Remove default border */
  background-color: transparent;
  height: 100%;
}

.el-menu--horizontal > .el-menu-item {
  color: white;
  height: 100%;
  line-height: 60px; /* Ensure items use full header height */
}
.el-menu--horizontal > .el-menu-item:hover {
  background-color: #337ecc; /* Darker shade on hover */
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: #ffd04b; /* Element Plus active color or custom */
  border-bottom: 2px solid #ffd04b;
  background-color: #337ecc;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  height: 100%;
}
.el-dropdown-link .el-icon {
  font-size: 24px; /* Ensure icon is visible */
}

/* Ensure dropdown items are styled if needed */
.el-dropdown-menu__item:hover {
  background-color: #ecf5ff;
  color: #409eff;
}
</style>
