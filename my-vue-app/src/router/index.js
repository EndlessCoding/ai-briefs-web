import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CategoryPage from '../views/CategoryPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import { authStore } from '../store/auth';
import { ElMessage } from 'element-plus';

// Admin Layout and Pages
import AdminLayout from '../components/layouts/AdminLayout.vue';
import AdminDashboardPage from '../views/admin/AdminDashboardPage.vue';
import ResourceManagementPage from '../views/admin/ResourceManagementPage.vue';
import ArticleManagementPage from '../views/admin/ArticleManagementPage.vue';
import BriefingManagementPage from '../views/admin/BriefingManagementPage.vue';
import SubscriptionManagementPage from '../views/admin/SubscriptionManagementPage.vue';
import AccessLogPage from '../views/admin/AccessLogPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/category/:categoryName',
    name: 'Category',
    component: CategoryPage,
    props: true,
    meta: {
      title: '分类新闻'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      title: '个人主页',
      requiresAuth: true
    }
  },
  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true, title: '管理后台' }, // Protect admin section
    redirect: '/admin/dashboard', // Default to dashboard
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboardPage,
        meta: { title: '总览' }
      },
      {
        path: 'resources',
        name: 'AdminResources',
        component: ResourceManagementPage,
        meta: { title: '资源管理' }
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: ArticleManagementPage,
        meta: { title: '文章管理' }
      },
      {
        path: 'briefings',
        name: 'AdminBriefings',
        component: BriefingManagementPage,
        meta: { title: '简报管理' }
      },
      {
        path: 'subscriptions',
        name: 'AdminSubscriptions',
        component: SubscriptionManagementPage,
        meta: { title: '订阅管理' }
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: AccessLogPage,
        meta: { title: '访问日志' }
      }
    ]
  },
  // Future routes can be added here
  // Example:
  // {
  //   path: '/news/:id',
  //   name: 'NewsDetail',
  //   component: () => import('../views/NewsDetailPage.vue'), // Lazy load
  //   props: true
  // },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/LoginPage.vue')
  // },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('../views/RegisterPage.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Using Vite's BASE_URL
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = (to.meta.title ? `${to.meta.title} - ` : '') + 'MyNewsAggregator';

  // Check for protected routes
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
      ElMessage.error('您需要登录才能访问此页面。将跳转到首页。');
      next({ name: 'Home' }); // Redirect to home page
    } else {
      next(); // Proceed to route
    }
  } else {
    next(); // Make sure to always call next()!
  }
});

export default router;
