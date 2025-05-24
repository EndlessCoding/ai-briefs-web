<template>
  <div class="profile-page">
    <el-card shadow="hover" class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人主页</span>
        </div>
      </template>

      <!-- User Info Display -->
      <div class="user-info-section">
        <el-avatar :size="100" :src="user.avatarUrl" class="user-avatar" />
        <h2 class="user-nickname">{{ user.nickname }}</h2>
      </div>

      <el-divider />

      <!-- Edit Email Section -->
      <div class="setting-section">
        <h3>邮箱地址</h3>
        <el-row :gutter="10" align="middle">
          <el-col :span="18">
            <el-input v-model="editableEmail" :disabled="!isEmailEditing" placeholder="请输入邮箱" />
          </el-col>
          <el-col :span="6">
            <el-button @click="toggleEmailEdit" :type="isEmailEditing ? 'success' : 'primary'">
              {{ isEmailEditing ? '保存' : '编辑' }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <!-- Subscriptions Section -->
      <div class="setting-section">
        <h3>订阅设置</h3>
        <el-row align="middle">
          <el-col :span="18">
            <span>开启每日新闻简报订阅</span>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-switch
              v-model="editableSubscriptionStatus"
              @change="handleSubscriptionChange"
              active-text="是"
              inactive-text="否"
            />
          </el-col>
        </el-row>
      </div>

      <el-divider />

      <!-- Other Functionalities Placeholder -->
      <div class="placeholder-section">
        <el-icon><InfoFilled /></el-icon>
        <span>更多功能正在开发中，敬请期待！</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElAvatar, ElInput, ElButton, ElSwitch, ElDivider, ElCard, ElIcon } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';
import { mockUser, updateUserEmail, updateUserSubscription } from '../assets/mockUser.js';
// import { authStore } from '../../store/auth'; // Not strictly needed if mockUser is the source of truth for profile page data

// User data state
const user = ref({ ...mockUser }); // Create a reactive copy
const editableEmail = ref('');
const isEmailEditing = ref(false);
const editableSubscriptionStatus = ref(false);

onMounted(() => {
  // TODO: API Call - Fetch user profile data from /api/profile or /api/users/me
  // For now, we use mockUser and re-sync it.
  user.value = { ...mockUser }; 
  editableEmail.value = user.value.email;
  editableSubscriptionStatus.value = user.value.isSubscribedToBriefings;
});

const toggleEmailEdit = () => {
  if (isEmailEditing.value) {
    // Attempt to save
    if (editableEmail.value !== user.value.email) {
      // TODO: API Call - Update user email at /api/profile/email or similar
      // The updateUserEmail function currently simulates this.
      if (updateUserEmail(editableEmail.value)) {
        user.value.email = editableEmail.value; 
        ElMessage.success('邮箱更新成功！');
      } else {
        ElMessage.error('邮箱更新失败。');
        editableEmail.value = user.value.email; 
      }
    }
  }
  isEmailEditing.value = !isEmailEditing.value;
};

const handleSubscriptionChange = (newValue) => {
  // TODO: API Call - Update user subscription status at /api/profile/subscription
  // The updateUserSubscription function currently simulates this.
  if (updateUserSubscription(newValue)) {
    user.value.isSubscribedToBriefings = newValue; 
    ElMessage.success(`新闻简报订阅已${newValue ? '开启' : '关闭'}。`);
  } else {
    ElMessage.error('订阅状态更新失败。');
    editableSubscriptionStatus.value = user.value.isSubscribedToBriefings;
  }
};

</script>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
}

.profile-card {
  border-radius: 8px;
}

.card-header span {
  font-size: 1.5em;
  font-weight: bold;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.user-nickname {
  font-size: 1.8em;
  color: #303133;
}

.setting-section {
  margin-bottom: 25px;
  padding: 0 10px;
}

.setting-section h3 {
  font-size: 1.2em;
  color: #606266;
  margin-bottom: 15px;
}

.placeholder-section {
  text-align: center;
  padding: 20px;
  color: #909399;
  background-color: #f7f7f7;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.el-divider {
  margin: 25px 0;
}
</style>
