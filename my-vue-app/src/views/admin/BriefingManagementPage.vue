<template>
  <div class="briefing-management-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header-content">
          <h1>简报管理</h1>
          <el-button type="primary" @click="handleCreate" :icon="Plus">新建简报</el-button>
        </div>
      </template>

      <!-- Filtering (Optional - simple status filter for now) -->
      <el-form :inline="true" @submit.prevent="loadBriefings" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="按状态筛选" clearable style="width: 180px;">
            <el-option label="Draft" value="draft" />
            <el-option label="Published" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFiltersAndLoad" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredBriefings" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="标题" sortable min-width="200" show-overflow-tooltip />
        <el-table-column prop="publishDate" label="发布日期" sortable width="180">
          <template #default="scope">{{ formatTableDate(scope.row.publishDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="包含文章数" width="130" align="center">
          <template #default="scope">{{ scope.row.articlesIncluded?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑</el-button>
            <el-popconfirm
              title="确定删除此简报吗？"
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

    <!-- Dialog for Create/Edit Briefing -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" @close="resetForm" top="5vh">
      <el-form ref="briefingFormRef" :model="briefingForm" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="标题" prop="title">
          <el-input v-model="briefingForm.title" placeholder="请输入简报标题" />
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="状态" prop="status">
                <el-select v-model="briefingForm.status" placeholder="请选择状态" style="width:100%;">
                    <el-option label="Draft" value="draft" />
                    <el-option label="Published" value="published" />
                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发布日期" prop="publishDate">
                <el-date-picker
                    v-model="briefingForm.publishDate"
                    type="datetime"
                    placeholder="选择发布日期和时间"
                    style="width:100%;"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DDTHH:mm:ssZ"
                />
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="包含文章" prop="articlesIncluded">
          <el-select
            v-model="briefingForm.articlesIncluded"
            multiple
            filterable
            placeholder="请选择要包含的文章"
            style="width:100%;"
            value-key="id" 
            :loading="articlesLoading"
            loading-text="加载文章中..."
          >
            <el-option
              v-for="article in allArticlesForSelection"
              :key="article.id"
              :label="article.title"
              :value="article.id"
            >
              <span style="float: left">{{ article.title }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                {{ article.category }}
              </span>
            </el-option>
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { 
  adminBriefingsState, 
  getBriefings, 
  addBriefing, 
  updateBriefing, 
  deleteBriefing 
} from '../../assets/mockAdminBriefings.js';
import { getArticles as getAllArticles } from '../../assets/mockNews.js'; // To select articles

const loading = ref(false);
const articlesLoading = ref(false);
const allBriefings = ref([]);
const filteredBriefings = ref([]);
const allArticlesForSelection = ref([]); // For the select dropdown

const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEditing = ref(false);

const briefingFormRef = ref(null);
const initialFormState = {
  id: null,
  title: '',
  status: 'draft',
  publishDate: new Date().toISOString(),
  articlesIncluded: []
};
const briefingForm = reactive({ ...initialFormState });

const formRules = {
  title: [{ required: true, message: '请输入简报标题', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
  articlesIncluded: [{ type: 'array', required: true, message: '请至少选择一篇文章', trigger: 'change' }]
};

const filters = reactive({
  status: ''
});

const loadBriefings = () => {
  loading.value = true;
  // TODO: API Call - Fetch briefings from /api/admin/briefings with filter parameters
  // The getBriefings() function currently simulates this.
  setTimeout(() => {
    allBriefings.value = getBriefings();
    applyFilters();
    loading.value = false;
  }, 100);
};

const loadArticlesForSelection = async () => {
  articlesLoading.value = true;
  // TODO: API Call - Fetch (published) articles from /api/articles?status=published or similar for selection
  // The getAllArticles().filter(...) currently simulates this.
  setTimeout(() => { 
    allArticlesForSelection.value = getAllArticles().filter(art => art.status === 'published');
    articlesLoading.value = false;
  }, 100);
};

const applyFiltersAndLoad = () => {
    loadBriefings();
}

const applyFilters = () => {
  let tempBriefings = [...allBriefings.value];
  if (filters.status) {
    tempBriefings = tempBriefings.filter(b => b.status === filters.status);
  }
  filteredBriefings.value = tempBriefings;
};

onMounted(() => {
  loadBriefings();
  loadArticlesForSelection(); // Load articles for the form select
});

const resetForm = () => {
  Object.assign(briefingForm, initialFormState);
  briefingForm.articlesIncluded = []; // Ensure array is reset
  briefingForm.publishDate = new Date().toISOString();
  if (briefingFormRef.value) {
    briefingFormRef.value.clearValidate();
  }
};

const handleCreate = () => {
  resetForm();
  isEditing.value = false;
  dialogTitle.value = '新建简报';
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  resetForm();
  isEditing.value = true;
  dialogTitle.value = '编辑简报';
  // Deep copy to avoid reactivity issues with the form vs table state
  Object.assign(briefingForm, JSON.parse(JSON.stringify(row)));
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!briefingFormRef.value) return;
  await briefingFormRef.value.validate((valid) => {
    if (valid) {
      const briefingData = { ...briefingForm };
      if (isEditing.value) {
        // TODO: API Call - Update briefing at /api/admin/briefings/:id
        // The updateBriefing function currently simulates this.
        const updated = updateBriefing(briefingData);
        if (updated) {
          ElMessage.success('简报更新成功！');
        } else {
          ElMessage.error('简报更新失败。');
        }
      } else {
        // TODO: API Call - Create new briefing at /api/admin/briefings
        // The addBriefing function currently simulates this.
        const added = addBriefing(briefingData);
        ElMessage.success(`简报 "${added.title}" 添加成功！`);
      }
      dialogVisible.value = false;
      loadBriefings(); // Refresh table data
    } else {
      ElMessage.error('请检查表单输入。');
      return false;
    }
  });
};

const handleDelete = (briefingId) => {
  // TODO: API Call - Delete briefing at /api/admin/briefings/:id
  // The deleteBriefing function currently simulates this.
  const success = deleteBriefing(briefingId);
  if (success) {
    ElMessage.success('简报删除成功！');
    loadBriefings(); // Refresh table data
  } else {
    ElMessage.error('简报删除失败。');
  }
};

const formatTableDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute:'2-digit' });
};

const getStatusTagType = (status) => {
  if (status === 'published') return 'success';
  if (status === 'draft') return 'warning';
  return 'info';
};

</script>

<style scoped>
.briefing-management-page {
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
