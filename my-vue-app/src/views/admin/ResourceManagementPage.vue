<template>
  <div class="admin-crud-page resource-management-page">
    <el-card class="page-card" shadow="never">
      <template #header>
        <div class="card-header-content">
          <div class="header-title-container">
            <el-icon :size="22" style="margin-right: 8px;"><Files /></el-icon>
            <h1 class="page-title">资源管理</h1>
          </div>
          <el-button type="primary" @click="handleCreate" :icon="Plus" class="header-action-button">新建资源</el-button>
        </div>
      </template>

      <!-- Filtering/Searching -->
      <el-form :inline="true" :model="filters" @submit.prevent="loadResources" class="filter-form-container">
        <el-form-item label="名称">
          <el-input v-model="filters.name" placeholder="按名称搜索" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="按类型筛选" clearable style="width: 160px;">
            <el-option label="RSS Feed" value="RSS Feed" />
            <el-option label="API Endpoint" value="API Endpoint" />
            <el-option label="Website" value="Website" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="按状态筛选" clearable style="width: 130px;">
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Pending" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadResources" :icon="Search">搜索</el-button>
          <el-button @click="resetFiltersAndLoad" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredResources" style="width: 100%" v-loading="loading" class="data-table">
        <el-table-column prop="name" label="名称" sortable min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" sortable width="150" show-overflow-tooltip>
            <template #default="scope">
                <el-tag :type="getResourceTypeTag(scope.row.type)" effect="light" size="small">{{ scope.row.type }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="url" label="URL" min-width="250" show-overflow-tooltip>
            <template #default="scope">
                <el-link :href="scope.row.url" target="_blank" type="primary" class="table-link">{{ scope.row.url }}</el-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" effect="light" size="small" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" sortable width="170" align="center">
          <template #default="scope">{{ formatTableDate(scope.row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit" type="primary" plain>编辑</el-button>
            <el-popconfirm
              title="确定删除此资源吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.id)"
              width="220"
              popper-class="admin-popconfirm"
            >
              <template #reference>
                <el-button size="small" type="danger" :icon="Delete" plain>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Pagination can be added here if many resources -->
      <!-- <el-pagination ... /> -->
    </el-card>

    <!-- Dialog for Create/Edit -->
    <el-dialog 
        v-model="dialogVisible" 
        :title="dialogTitle" 
        width="clamp(500px, 60%, 700px)" 
        @close="resetForm" 
        class="form-dialog"
        top="10vh"
        append-to-body
      >
      <el-form ref="resourceFormRef" :model="resourceForm" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select v-model="resourceForm.type" placeholder="请选择资源类型" style="width:100%;">
            <el-option label="RSS Feed" value="RSS Feed" />
            <el-option label="API Endpoint" value="API Endpoint" />
            <el-option label="Website" value="Website" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源URL" prop="url">
          <el-input v-model="resourceForm.url" placeholder="请输入资源URL (例如: https://example.com)" />
        </el-form-item>
        <el-form-item label="当前状态" prop="status">
          <el-select v-model="resourceForm.status" placeholder="请选择状态" style="width:100%;">
            <el-option label="Active (活动)" value="active" />
            <el-option label="Inactive (暂停)" value="inactive" />
            <el-option label="Pending (待审核)" value="pending" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="formSubmitting">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElIcon } from 'element-plus';
import { Plus, Edit, Delete, Search, Refresh, Files } from '@element-plus/icons-vue';
import { getResources, addResource, updateResource, deleteResource } from '../../assets/mockAdminResources.js';

const loading = ref(false);
const formSubmitting = ref(false); // For dialog submit button
const allResources = ref([]); 
const filteredResources = ref([]); 

const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEditing = ref(false);

const resourceFormRef = ref(null);
const initialFormState = {
  id: null,
  name: '',
  type: '',
  url: '',
  status: 'pending'
};
const resourceForm = reactive({ ...initialFormState });

const formRules = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  url: [
    { required: true, message: '请输入资源URL', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL格式 (如 https://example.com)', trigger: ['blur', 'change'] }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

const filters = reactive({
  name: '',
  type: '',
  status: ''
});

const loadResources = () => {
  loading.value = true;
  // TODO: API Call - Fetch resources from /api/admin/resources with filter parameters
  setTimeout(() => {
    allResources.value = getResources(); 
    applyFilters();
    loading.value = false;
  }, 200);
};

const applyFilters = () => {
  let tempResources = [...allResources.value];
  if (filters.name) {
    tempResources = tempResources.filter(r => r.name.toLowerCase().includes(filters.name.toLowerCase()));
  }
  if (filters.type) {
    tempResources = tempResources.filter(r => r.type === filters.type);
  }
  if (filters.status) {
    tempResources = tempResources.filter(r => r.status === filters.status);
  }
  filteredResources.value = tempResources;
};

const resetFiltersAndLoad = () => {
  filters.name = '';
  filters.type = '';
  filters.status = '';
  loadResources();
};

onMounted(() => {
  loadResources();
});

const resetForm = () => {
  Object.assign(resourceForm, initialFormState);
  if (resourceFormRef.value) {
    resourceFormRef.value.clearValidate();
  }
};

const handleCreate = () => {
  resetForm();
  isEditing.value = false;
  dialogTitle.value = '新建资源';
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  resetForm();
  isEditing.value = true;
  dialogTitle.value = '编辑资源';
  Object.assign(resourceForm, JSON.parse(JSON.stringify(row))); // Deep copy
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!resourceFormRef.value) return;
  formSubmitting.value = true;
  await resourceFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditing.value) {
          // TODO: API Call - Update resource at /api/admin/resources/:id
          const updated = updateResource({ ...resourceForm });
          if (updated) {
            ElMessage.success('资源更新成功！');
          } else {
            ElMessage.error('资源更新失败。');
          }
        } else {
          // TODO: API Call - Create new resource at /api/admin/resources
          const added = addResource({ ...resourceForm });
          ElMessage.success(`资源 "${added.name}" 添加成功！`);
        }
        dialogVisible.value = false;
        loadResources(); 
      } catch (error) {
        ElMessage.error('操作失败，请稍后再试。');
        console.error("Form submission error:", error);
      }
    } else {
      ElMessage.error('请检查表单输入是否正确。');
    }
    formSubmitting.value = false;
  });
};

const handleDelete = (resourceId) => {
  // TODO: API Call - Delete resource at /api/admin/resources/:id
  const success = deleteResource(resourceId);
  if (success) {
    ElMessage.success('资源删除成功！');
    loadResources(); 
  } else {
    ElMessage.error('资源删除失败。');
  }
};

const formatTableDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getStatusTagType = (status) => {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'info';
  if (status === 'pending') return 'warning';
  return ''; // Element Plus default
};
const getResourceTypeTag = (type) => {
    if (type === 'RSS Feed') return 'success';
    if (type === 'API Endpoint') return 'warning';
    if (type === 'Website') return 'primary';
    return 'info';
};

// No longer using computed()._watcher.run for filters, rely on explicit search button.
</script>

<style scoped>
/* General Admin CRUD Page Styles - can be extracted to a common admin CSS file later */
.admin-crud-page {
  padding: 24px;
  font-family: var(--font-family-primary);
  background-color: var(--color-background-secondary);
}

.page-card {
  /* Uses global .el-card styling from main.css */
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title-container {
    display: flex;
    align-items: center;
    color: var(--color-text-primary);
}
.page-title {
  font-size: 1.5rem; /* H2 Style */
  font-weight: 700;
  margin: 0; /* Reset margin for h1 */
}
.header-action-button.el-button {
    font-weight: 500; /* Medium for primary buttons */
}


.filter-form-container {
  padding: 16px;
  background-color: var(--color-background-primary); /* White background for filter area */
  border-radius: 6px; /* Softer radius */
  margin-bottom: 20px;
  border: 1px solid var(--color-border-subtle);
}
.filter-form-container .el-form-item {
  margin-bottom: 0; /* Remove bottom margin for inline form items */
}

.data-table {
  margin-top: 0; /* Table directly below filters or header */
}
/* Table header style */
:deep(.el-table__header-wrapper th) {
  background-color: var(--color-background-secondary) !important; /* Light gray for table header */
  color: var(--color-text-primary) !important;
  font-weight: 600;
}
.table-link.el-link {
    font-size: inherit; /* Ensure link size matches table text */
}
/* Action buttons in table */
.el-table .el-button--small {
    padding: 7px 10px; /* Slightly more padding for small buttons */
    font-weight: 500;
}
.el-table .el-button + .el-button,
.el-table .el-button + .el-popconfirm .el-button {
  margin-left: 8px;
}


/* Dialog Styles */
:deep(.form-dialog .el-dialog__header) {
  padding: 16px 24px;
  background-color: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border-standard);
  margin-right: 0; /* Reset margin if any */
}
:deep(.form-dialog .el-dialog__title) {
  font-family: var(--font-family-primary);
  font-size: 1.25rem; /* H4 Style */
  font-weight: 600;
  color: var(--color-text-primary);
}
:deep(.form-dialog .el-dialog__body) {
  padding: 24px; /* Consistent padding */
}
.dialog-footer {
    padding: 10px 24px 20px;
    text-align: right;
    border-top: 1px solid var(--color-border-subtle);
}
.dialog-footer .el-button {
    font-weight: 500;
}

/* Popconfirm styling (if needed, though Element Plus handles it well) */
/* :global(.admin-popconfirm.el-popover) {} */

</style>
