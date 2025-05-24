<template>
  <div class="subscription-management-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header-content">
          <h1>订阅管理</h1>
          <el-button type="primary" @click="handleCreate" :icon="Plus">新建订阅</el-button>
        </div>
      </template>

      <!-- Filtering/Searching -->
      <el-form :inline="true" @submit.prevent="loadSubscriptions" class="filter-form">
        <el-form-item label="邮箱">
          <el-input v-model="filters.email" placeholder="按邮箱搜索" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="按状态筛选" clearable style="width: 150px;">
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Unsubscribed" value="unsubscribed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFiltersAndLoad" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredSubscriptions" style="width: 100%" v-loading="loading">
        <el-table-column prop="email" label="邮箱" sortable min-width="220" show-overflow-tooltip />
        <el-table-column prop="subscribedDate" label="订阅日期" sortable width="180">
          <template #default="scope">{{ formatTableDate(scope.row.subscribedDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="130" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑状态</el-button>
            <el-popconfirm
              title="确定删除此订阅吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)"
              width="220"
            >
              <template #reference>
                <el-button size="small" type="danger" :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog for Create/Edit Subscription -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="resetForm" top="10vh">
      <el-form ref="subscriptionFormRef" :model="subscriptionForm" :rules="formRules" label-width="80px" label-position="right">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="subscriptionForm.email" placeholder="请输入邮箱地址" :disabled="isEditing" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="subscriptionForm.status" placeholder="请选择状态" style="width:100%;">
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Unsubscribed" value="unsubscribed" />
          </el-select>
        </el-form-item>
         <el-form-item label="订阅日期" prop="subscribedDate" v-if="!isEditing">
            <el-date-picker
                v-model="subscriptionForm.subscribedDate"
                type="datetime"
                placeholder="选择订阅日期"
                style="width:100%;"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DDTHH:mm:ssZ"
            />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { 
  getSubscriptions, 
  addSubscription, 
  updateSubscription, // Using full update for flexibility, can be specific to status
  deleteSubscription 
} from '../../assets/mockAdminSubscriptions.js';

const loading = ref(false);
const allSubscriptions = ref([]);
const filteredSubscriptions = ref([]);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEditing = ref(false);

const subscriptionFormRef = ref(null);
const initialFormState = {
  id: null,
  email: '',
  status: 'active',
  subscribedDate: new Date().toISOString()
};
const subscriptionForm = reactive({ ...initialFormState });

const formRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  subscribedDate: [{ required: true, message: '请选择订阅日期', trigger: 'change' }]
};

const filters = reactive({
  email: '',
  status: ''
});

const loadSubscriptions = () => {
  loading.value = true;
  // TODO: API Call - Fetch subscriptions from /api/admin/subscriptions with filter parameters
  // The getSubscriptions() function currently simulates this.
  setTimeout(() => { 
    allSubscriptions.value = getSubscriptions();
    applyFilters();
    loading.value = false;
  }, 100);
};

const applyFiltersAndLoad = () => {
    loadSubscriptions();
}

const applyFilters = () => {
  let tempSubscriptions = [...allSubscriptions.value];
  if (filters.email) {
    tempSubscriptions = tempSubscriptions.filter(s => s.email.toLowerCase().includes(filters.email.toLowerCase()));
  }
  if (filters.status) {
    tempSubscriptions = tempSubscriptions.filter(s => s.status === filters.status);
  }
  filteredSubscriptions.value = tempSubscriptions;
};

onMounted(() => {
  loadSubscriptions();
});

const resetForm = () => {
  Object.assign(subscriptionForm, initialFormState);
  subscriptionForm.subscribedDate = new Date().toISOString();
  if (subscriptionFormRef.value) {
    subscriptionFormRef.value.clearValidate();
  }
};

const handleCreate = () => {
  resetForm();
  isEditing.value = false;
  dialogTitle.value = '新建订阅';
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  resetForm();
  isEditing.value = true;
  dialogTitle.value = '编辑订阅状态';
  // Copy only relevant fields for editing, especially if email shouldn't be changed here.
  subscriptionForm.id = row.id;
  subscriptionForm.email = row.email; // Keep email, disable input
  subscriptionForm.status = row.status;
  // subscribedDate is not typically edited, so we don't need to copy it for editing form
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!subscriptionFormRef.value) return;
  await subscriptionFormRef.value.validate((valid) => {
    if (valid) {
      const subscriptionData = { ...subscriptionForm };
      if (isEditing.value) {
        // TODO: API Call - Update subscription at /api/admin/subscriptions/:id
        // The updateSubscription function currently simulates this.
        const updated = updateSubscription(subscriptionData); 
        if (updated) {
          ElMessage.success('订阅状态更新成功！');
        } else {
          ElMessage.error('订阅状态更新失败。');
        }
      } else {
        // TODO: API Call - Create new subscription at /api/admin/subscriptions
        // The addSubscription function currently simulates this.
        const added = addSubscription(subscriptionData);
        if (added) {
          ElMessage.success(`订阅 "${added.email}" 添加成功！`);
        } else {
          ElMessage.warning(`订阅 "${subscriptionData.email}" 已存在或添加失败。`);
        }
      }
      dialogVisible.value = false;
      loadSubscriptions(); // Refresh table data
    } else {
      ElMessage.error('请检查表单输入。');
      return false;
    }
  });
};

const handleDelete = (subscriptionId) => {
  // TODO: API Call - Delete subscription at /api/admin/subscriptions/:id
  // The deleteSubscription function currently simulates this.
  const success = deleteSubscription(subscriptionId);
  if (success) {
    ElMessage.success('订阅删除成功！');
    loadSubscriptions(); // Refresh table data
  } else {
    ElMessage.error('订阅删除失败。');
  }
};

const formatTableDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getStatusTagType = (status) => {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'warning';
  if (status === 'unsubscribed') return 'info';
  return 'primary';
};

</script>

<style scoped>
.subscription-management-page {
  padding: 20px;
}
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header-content h1 {
  margin: 0;
  font-size: 1.5em;
}
.filter-form {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9fafc;
  border-radius: 4px;
}
.el-table {
  margin-top: 15px;
}
.el-table .el-button + .el-button,
.el-table .el-button + .el-popconfirm .el-button {
  margin-left: 8px;
}
.el-dialog .el-select, .el-dialog .el-date-picker {
    width: 100%;
}
</style>
