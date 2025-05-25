<template>
  <div class="admin-crud-page article-management-page">
    <el-card class="page-card" shadow="never">
      <template #header>
        <div class="card-header-content">
          <div class="header-title-container">
            <el-icon :size="22" style="margin-right: 8px;"><Document /></el-icon>
            <h1 class="page-title">文章管理</h1>
          </div>
          <el-button type="primary" @click="handleCreate" :icon="Plus" class="header-action-button">新建文章</el-button>
        </div>
      </template>

      <!-- Filtering/Searching -->
      <el-form :inline="true" @submit.prevent="applyFiltersAndLoad" class="filter-form-container">
        <el-form-item label="标题">
          <el-input v-model="filters.title" placeholder="按标题搜索" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="按分类筛选" clearable style="width: 160px;">
            <el-option v-for="cat in uniqueCategories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="按状态筛选" clearable style="width: 160px;">
            <el-option label="Published" value="published" />
            <el-option label="Draft" value="draft" />
            <el-option label="Pending Review" value="pending review" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFiltersAndLoad" :icon="Search">搜索</el-button>
          <el-button @click="resetFiltersAndLoad" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="paginatedArticles" style="width: 100%" v-loading="loading" class="data-table">
        <el-table-column prop="title" label="标题" sortable min-width="220" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" sortable width="130" show-overflow-tooltip>
            <template #default="scope">
                <el-tag :type="getCategoryTagType(scope.row.category)" effect="light" size="small">{{ scope.row.category }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="publishDate" label="发布日期" sortable width="170" align="center">
          <template #default="scope">{{ formatTableDate(scope.row.publishDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="140" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" effect="light" size="small" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag" size="small" effect="plain" class="table-tag">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit" type="primary" plain>编辑</el-button>
            <el-popconfirm
              title="确定删除此文章吗？"
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

      <el-pagination
        v-if="totalFilteredArticles > 0"
        class="pagination-container"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalFilteredArticles"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
       <el-empty v-if="!loading && totalFilteredArticles === 0" description="暂无符合条件的文章" />
    </el-card>

    <!-- Dialog for Create/Edit Article -->
    <el-dialog 
        v-model="dialogVisible" 
        :title="dialogTitle" 
        width="clamp(600px, 70%, 900px)" 
        @close="resetForm" 
        class="form-dialog"
        top="5vh" /* Slightly lower from top for better visibility */
        append-to-body
      >
      <el-form ref="articleFormRef" :model="articleForm" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章分类" prop="category">
          <el-select v-model="articleForm.category" placeholder="请选择或输入分类" filterable allow-create default-first-option style="width:100%;">
            <el-option v-for="cat in uniqueCategoriesForForm" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input v-model="articleForm.content" type="textarea" :autosize="{ minRows: 5, maxRows: 15 }" placeholder="请输入文章内容 (支持Markdown)" />
        </el-form-item>
        <el-form-item label="文章标签" prop="tags">
          <el-select
            v-model="articleForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入或选择标签，按Enter创建新标签"
            style="width:100%;"
            :multiple-limit="5" 
          >
            <el-option v-for="tag in uniqueTagsForForm" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="当前状态" prop="status">
                <el-select v-model="articleForm.status" placeholder="请选择状态" style="width:100%;">
                    <el-option label="Published (已发布)" value="published" />
                    <el-option label="Draft (草稿)" value="draft" />
                    <el-option label="Pending Review (待审核)" value="pending review" />
                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发布日期" prop="publishDate">
                <el-date-picker
                    v-model="articleForm.publishDate"
                    type="datetime"
                    placeholder="选择发布日期和时间"
                    style="width:100%;"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DDTHH:mm:ssZ"
                />
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="文章摘要" prop="summary">
          <el-input v-model="articleForm.summary" type="textarea" :rows="3" placeholder="请输入文章摘要 (可选，若留空会自动截取内容前200字)" />
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
import { Plus, Edit, Delete, Search, Refresh, Document } from '@element-plus/icons-vue';
import { 
  getArticles, 
  addArticle, 
  updateArticle, 
  deleteArticle,
  getUniqueCategories,
  getUniqueTags
} from '../../assets/mockNews.js'; 

const loading = ref(false);
const formSubmitting = ref(false);
const allArticles = ref([]);
const filteredArticles = ref([]); // For table after filtering, before pagination
const paginatedArticles = ref([]); // For current table page

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);
const totalFilteredArticles = ref(0);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEditing = ref(false);

const articleFormRef = ref(null);
const initialFormState = {
  id: null,
  title: '',
  category: '',
  content: '',
  tags: [],
  status: 'draft',
  publishDate: new Date().toISOString(),
  summary: ''
};
const articleForm = reactive({ ...initialFormState });

const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择或输入分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }]
};

const filters = reactive({
  title: '',
  category: '',
  status: ''
});

const uniqueCategories = ref([]);
const uniqueTags = ref([]);
const uniqueCategoriesForForm = computed(() => getUniqueCategories());
const uniqueTagsForForm = computed(() => getUniqueTags());


const loadArticles = () => {
  loading.value = true;
  // TODO: API Call - Fetch articles from /api/admin/articles with filter parameters
  setTimeout(() => {
    allArticles.value = getArticles(); 
    uniqueCategories.value = getUniqueCategories(); 
    uniqueTags.value = getUniqueTags(); 
    applyFilters(); 
    loading.value = false;
  }, 100); 
};

const applyFiltersAndLoad = () => { 
    currentPage.value = 1;
    loadArticles(); 
}

const applyFilters = () => {
  let tempArticles = [...allArticles.value];
  if (filters.title) {
    tempArticles = tempArticles.filter(a => a.title.toLowerCase().includes(filters.title.toLowerCase()));
  }
  if (filters.category) {
    tempArticles = tempArticles.filter(a => a.category === filters.category);
  }
  if (filters.status) {
    tempArticles = tempArticles.filter(a => a.status === filters.status);
  }
  filteredArticles.value = tempArticles;
  totalFilteredArticles.value = filteredArticles.value.length;
  updatePaginatedArticles();
};

const resetFiltersAndLoad = () => {
    filters.title = '';
    filters.category = '';
    filters.status = '';
    applyFiltersAndLoad();
};

const updatePaginatedArticles = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  paginatedArticles.value = filteredArticles.value.slice(start, end);
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  updatePaginatedArticles();
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  updatePaginatedArticles();
};

onMounted(() => {
  loadArticles();
});

const resetForm = () => {
  Object.assign(articleForm, initialFormState);
  articleForm.tags = []; 
  articleForm.publishDate = new Date().toISOString(); 
  if (articleFormRef.value) {
    articleFormRef.value.clearValidate();
  }
};

const handleCreate = () => {
  resetForm();
  isEditing.value = false;
  dialogTitle.value = '新建文章';
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  resetForm();
  isEditing.value = true;
  dialogTitle.value = '编辑文章';
  Object.assign(articleForm, JSON.parse(JSON.stringify(row))); 
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!articleFormRef.value) return;
  formSubmitting.value = true;
  await articleFormRef.value.validate(async (valid) => {
    if (valid) {
      const articleData = { ...articleForm };
      if (!Array.isArray(articleData.tags)) {
        articleData.tags = articleData.tags ? String(articleData.tags).split(',').map(t => t.trim()) : [];
      }
      // Auto-generate summary if empty
      if (!articleData.summary && articleData.content) {
          articleData.summary = articleData.content.substring(0, 200) + (articleData.content.length > 200 ? '...' : '');
      }

      try {
        if (isEditing.value) {
          // TODO: API Call - Update article at /api/admin/articles/:id
          const updated = updateArticle(articleData);
          if (updated) {
            ElMessage.success('文章更新成功！');
          } else {
            ElMessage.error('文章更新失败。');
          }
        } else {
          // TODO: API Call - Create new article at /api/admin/articles
          const added = addArticle(articleData);
          ElMessage.success(`文章 "${added.title}" 添加成功！`);
        }
        dialogVisible.value = false;
        loadArticles(); 
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

const handleDelete = (articleId) => {
  // TODO: API Call - Delete article at /api/admin/articles/:id
  const success = deleteArticle(articleId);
  if (success) {
    ElMessage.success('文章删除成功！');
    loadArticles(); 
  } else {
    ElMessage.error('文章删除失败。');
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
  if (status === 'pending review') return 'info';
  return ''; // Element Plus default
};

const getCategoryTagType = (category) => {
    const hash = category.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const colors = ['primary', 'success', 'info', 'warning', 'danger'];
    return colors[Math.abs(hash) % colors.length];
};

</script>

<style scoped>
/* Using common admin CRUD page styles from ResourceManagementPage.vue */
/* Add any specific styles for Article Management below if needed */
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
  margin: 0; 
}
.header-action-button.el-button {
    font-weight: 500;
}

.filter-form-container {
  padding: 16px;
  background-color: var(--color-background-primary);
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border-subtle);
}
.filter-form-container .el-form-item {
  margin-bottom: 0; 
}

.data-table {
  margin-top: 0; 
}
:deep(.el-table__header-wrapper th) {
  background-color: var(--color-background-secondary) !important;
  color: var(--color-text-primary) !important;
  font-weight: 600;
}
.table-tag {
    margin-right: 4px;
    margin-bottom: 4px; /* For wrapping */
}
.el-table .el-button--small {
    padding: 7px 10px; 
    font-weight: 500;
}
.el-table .el-button + .el-button,
.el-table .el-button + .el-popconfirm .el-button {
  margin-left: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.form-dialog .el-dialog__header) {
  padding: 16px 24px;
  background-color: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border-standard);
  margin-right: 0;
}
:deep(.form-dialog .el-dialog__title) {
  font-family: var(--font-family-primary);
  font-size: 1.25rem; /* H4 Style */
  font-weight: 600;
  color: var(--color-text-primary);
}
:deep(.form-dialog .el-dialog__body) {
  padding: 24px; 
  max-height: 70vh; /* Allow body scroll for long forms */
  overflow-y: auto;
}
.dialog-footer {
    padding: 10px 24px 20px;
    text-align: right;
    border-top: 1px solid var(--color-border-subtle);
}
.dialog-footer .el-button {
    font-weight: 500;
}
</style>
