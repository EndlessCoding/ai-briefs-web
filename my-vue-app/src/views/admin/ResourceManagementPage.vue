<template>
  <div class="resource-management-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header-content">
          <h1>资源管理</h1>
          <el-button type="primary" @click="handleCreate" :icon="Plus">新建资源</el-button>
        </div>
      </template>

      <!-- Filtering/Searching (Optional Bonus) -->
      <el-form :inline="true" :model="filters" @submit.prevent="loadResources" class="filter-form">
        <el-form-item label="名称">
          <el-input v-model="filters.name" placeholder="按名称搜索" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="按类型筛选" clearable>
            <el-option label="RSS Feed" value="RSS Feed" />
            <el-option label="API Endpoint" value="API Endpoint" />
            <el-option label="Website" value="Website" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="按状态筛选" clearable>
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Pending" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadResources" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredResources" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="名称" sortable min-width="180" />
        <el-table-column prop="type" label="类型" sortable width="150">
            <template #default="scope">
                <el-tag :type="getResourceTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="url" label="URL" min-width="250">
            <template #default="scope">
                <el-link :href="scope.row.url" target="_blank" type="primary">{{ scope.row.url }}</el-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" sortable width="180">
          <template #default="scope">{{ formatTableDate(scope.row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑</el-button>
            <el-popconfirm
              title="确定删除此资源吗？"
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

    <!-- Dialog for Create/Edit -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="resetForm">
      <el-form ref="resourceFormRef" :model="resourceForm" :rules="formRules" label-width="80px" label-position="right">
        <el-form-item label="名称" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="resourceForm.type" placeholder="请选择资源类型" style="width:100%;">
            <el-option label="RSS Feed" value="RSS Feed" />
            <el-option label="API Endpoint" value="API Endpoint" />
            <el-option label="Website" value="Website" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="resourceForm.url" placeholder="请输入资源URL" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="resourceForm.status" placeholder="请选择状态" style="width:100%;">
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Pending" value="pending" />
          </el-select>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { adminResourcesState, getResources, addResource, updateResource, deleteResource } from '../../assets/mockAdminResources.js';

const loading = ref(false);
const allResources = ref([]); // Holds all resources from the mock service
const filteredResources = ref([]); // Holds resources after filtering

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
    { type: 'url', message: '请输入有效的URL', trigger: ['blur', 'change'] }
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
  // The getResources() function currently simulates this.
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

onMounted(() => {
  loadResources();
});

// Watch for changes in adminResourcesState.resources from the mock file to keep table in sync
// This is a simple way to react to changes if another component could modify it.
// For this specific page, direct calls to loadResources after CUD operations are sufficient.
// watch(() => adminResourcesState.resources, (newResources) => {
//   allResources.value = [...newResources];
//   applyFilters();
// }, { deep: true });


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
  Object.assign(resourceForm, row); // Copy row data to form
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!resourceFormRef.value) return;
  await resourceFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditing.value) {
        // TODO: API Call - Update resource at /api/admin/resources/:id
        // The updateResource function currently simulates this.
        const updated = updateResource({ ...resourceForm });
        if (updated) {
          ElMessage.success('资源更新成功！');
        } else {
          ElMessage.error('资源更新失败。');
        }
      } else {
        // TODO: API Call - Create new resource at /api/admin/resources
        // The addResource function currently simulates this.
        const added = addResource({ ...resourceForm });
        ElMessage.success(`资源 "${added.name}" 添加成功！`);
      }
      dialogVisible.value = false;
      loadResources(); // Refresh table data
    } else {
      ElMessage.error('请检查表单输入。');
      return false;
    }
  });
};

const handleDelete = (resourceId) => {
  // TODO: API Call - Delete resource at /api/admin/resources/:id
  // The deleteResource function currently simulates this.
  const success = deleteResource(resourceId);
  if (success) {
    ElMessage.success('资源删除成功！');
    loadResources(); // Refresh table data
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
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'info';
    case 'pending': return 'warning';
    default: return 'primary';
  }
};
const getResourceTypeTag = (type) => {
    // Simple mapping for variety, can be expanded
    if (type === 'RSS Feed') return 'success';
    if (type === 'API Endpoint') return 'warning';
    if (type === 'Website') return ''; // Default
    return 'info';
};

// Watch filters and re-apply
Object.keys(filters).forEach(key => {
  computed(() => filters[key])._watcher.run = () => applyFilters();
});

</script>

<style scoped>
.resource-management-page {
  padding: 20px;
}
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header-content h1 {
  margin: 0; /* Reset margin for h1 inside flex */
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
.el-dialog .el-select {
    width: 100%;
}
</style>
