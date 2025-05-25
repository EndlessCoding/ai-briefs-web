<template>
  <div class="profile-page">
    <el-card class="profile-card-main" shadow="never">
      <template #header>
        <div class="card-header-title">
          <el-icon :size="22" style="margin-right: 8px;"><User /></el-icon>
          <span>个人主页</span>
        </div>
      </template>

      <!-- User Info Display -->
      <section class="profile-section user-info-display">
        <el-avatar :size="120" :src="user.avatarUrl" class="user-avatar-large" />
        <h2 class="user-nickname-display">{{ user.nickname }}</h2>
        <p class="user-email-display">{{ user.email }}</p>
      </section>

      <el-divider />

      <!-- Edit Email Section -->
      <section class="profile-section">
        <h3 class="section-title">管理邮箱地址</h3>
        <el-row :gutter="16" align="middle" class="setting-row">
          <el-col :xs="24" :sm="isEmailEditing ? 16 : 24" :md="isEmailEditing ? 18 : 17">
            <el-input 
              v-model="editableEmail" 
              :disabled="!isEmailEditing" 
              placeholder="请输入新的邮箱地址" 
              size="large"
              class="email-input"
            >
              <template #prepend v-if="!isEmailEditing">
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="isEmailEditing ? 8 : 24" :md="isEmailEditing ? 6 : 7" class="action-col">
            <el-button 
              @click="toggleEmailEdit" 
              :type="isEmailEditing ? 'success' : 'primary'" 
              size="large" 
              :icon="isEmailEditing ? Check : Edit"
              class="edit-save-button"
              plain
            >
              {{ isEmailEditing ? '保存邮箱' : '编辑邮箱' }}
            </el-button>
          </el-col>
        </el-row>
      </section>

      <el-divider />

      <!-- Subscriptions Section -->
      <section class="profile-section">
        <h3 class="section-title">订阅设置</h3>
        <div class="setting-row subscription-row">
          <span class="setting-label">开启每日新闻简报订阅</span>
          <el-switch
            v-model="editableSubscriptionStatus"
            @change="handleSubscriptionChange"
            size="large"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            active-text="是"
            inactive-text="否"
          />
        </div>
      </section>

      <el-divider />

      <!-- Other Functionalities Placeholder -->
      <section class="profile-section placeholder-info">
        <el-icon :size="20" style="margin-right: 8px;"><InfoFilled /></el-icon>
        <span>更多账户设置功能正在开发中，敬请期待！</span>
      </section>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElAvatar, ElInput, ElButton, ElSwitch, ElDivider, ElCard, ElIcon, ElRow, ElCol } from 'element-plus';
import { User, Message, Edit, Check, Close, InfoFilled } from '@element-plus/icons-vue'; // Added icons
import { mockUser, updateUserEmail, updateUserSubscription } from '../assets/mockUser.js';

const user = ref({ ...mockUser });
const editableEmail = ref('');
const isEmailEditing = ref(false);
const editableSubscriptionStatus = ref(false);

onMounted(() => {
  // TODO: API Call - Fetch user profile data from /api/profile or /api/users/me
  user.value = { ...mockUser }; 
  editableEmail.value = user.value.email;
  editableSubscriptionStatus.value = user.value.isSubscribedToBriefings;
});

const toggleEmailEdit = () => {
  if (isEmailEditing.value) {
    if (editableEmail.value !== user.value.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableEmail.value)) {
        ElMessage.error('请输入有效的邮箱地址格式。');
        return;
      }
      // TODO: API Call - Update user email at /api/profile/email or similar
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
  padding: 24px; /* Consistent page padding */
  max-width: 860px; /* Slightly wider for better spacing */
  margin: 24px auto;
  font-family: var(--font-family-primary);
  background-color: var(--color-background-secondary); /* Page background */
}

.profile-card-main {
  /* Uses global .el-card styling from main.css for border-radius and shadow */
  background-color: var(--color-background-primary);
}

.card-header-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem; /* H2 from style guide */
  font-weight: 700; /* Bold */
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

.profile-section {
  margin-bottom: 32px; /* Consistent spacing between sections */
  padding: 0 8px; /* Slight horizontal padding within sections */
}
.profile-section:last-child {
  margin-bottom: 0;
}

.user-info-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0; /* Spacing around avatar and text */
}

.user-avatar-large {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  border: 3px solid var(--color-border-subtle);
}

.user-nickname-display {
  font-family: var(--font-family-primary);
  font-size: 1.75rem; /* H2 */
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}
.user-email-display {
  font-family: var(--font-family-primary);
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.section-title {
  font-family: var(--font-family-primary);
  font-size: 1.25rem; /* H4 style */
  font-weight: 600; /* Semi-bold */
  color: var(--color-text-primary);
  margin-bottom: 20px; /* Space below section title */
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between; /* For subscription row */
}
.email-input {
    font-family: var(--font-family-primary);
}
.action-col {
    text-align: right;
}
.edit-save-button.el-button {
    min-width: 110px; /* Ensure button has enough width */
    font-weight: 500; /* Medium from style guide */
}
/* Ensure plain primary button has correct text color */
.edit-save-button.el-button--primary.is-plain {
    color: var(--color-primary);
}
.edit-save-button.el-button--primary.is-plain:hover,
.edit-save-button.el-button--primary.is-plain:focus {
    color: #fff; /* Text becomes white on hover/focus due to background change */
    background-color: var(--color-primary);
    border-color: var(--color-primary);
}


.subscription-row .setting-label {
  font-family: var(--font-family-primary);
  font-size: 1rem;
  color: var(--color-text-primary);
}

.placeholder-info {
  text-align: center;
  padding: 24px;
  color: var(--color-text-placeholder);
  background-color: var(--color-background-secondary); /* Subtle background */
  border-radius: 6px; /* Softer radius */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-size: 0.95rem;
}

.el-divider {
  margin: 32px 0; /* Increased margin for visual separation */
  border-color: var(--color-border-subtle);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .profile-page {
    padding: 16px;
    margin: 16px auto;
  }
  .card-header-title {
    font-size: 1.25rem; /* H3 */
  }
  .user-avatar-large {
    width: 100px;
    height: 100px;
  }
  .user-nickname-display {
    font-size: 1.5rem; /* H2 */
  }
  .section-title {
    font-size: 1.125rem; /* H4 */
  }
  .setting-row, .profile-section .el-row {
    flex-direction: column;
    align-items: stretch;
  }
  .setting-row .action-col, 
  .profile-section .el-row .action-col {
    text-align: left;
    margin-top: 12px; /* Space between input and button when stacked */
  }
  .edit-save-button.el-button {
    width: 100%; /* Full width button on mobile */
  }
  .subscription-row {
    align-items: center; /* Keep items centered when stacked if desired, or stretch */
  }
  .subscription-row .setting-label {
    margin-bottom: 10px; /* Space when switch is below */
  }
}
</style>
