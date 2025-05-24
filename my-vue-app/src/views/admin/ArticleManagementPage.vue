<template>
  <div class="article-management-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header-content">
          <h1>文章管理</h1>
          <el-button type="primary" @click="handleCreate" :icon="Plus">新建文章</el-button>
        </div>
      </template>

      <!-- Filtering/Searching -->
      <el-form :inline="true" @submit.prevent="loadArticles" class="filter-form">
        <el-form-item label="标题">
          <el-input v-model="filters.title" placeholder="按标题搜索" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="按分类筛选" clearable style="width: 150px;">
            <el-option v-for="cat in uniqueCategories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="按状态筛选" clearable style="width: 150px;">
            <el-option label="Published" value="published" />
            <el-option label="Draft" value="draft" />
            <el-option label="Pending Review" value="pending review" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFiltersAndLoad" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredArticles" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="标题" sortable min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" sortable width="120">
            <template #default="scope">
                <el-tag :type="getCategoryTagType(scope.row.category)">{{ scope.row.category }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="publishDate" label="发布日期" sortable width="170">
          <template #default="scope">{{ formatTableDate(scope.row.publishDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="140" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag" size="small" style="margin-right: 5px; margin-bottom: 2px;">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑</el-button>
            <el-popconfirm
              title="确定删除此文章吗？"
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

    <!-- Dialog for Create/Edit Article -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="750px" @close="resetForm" top="5vh">
      <el-form ref="articleFormRef" :model="articleForm" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="articleForm.category" placeholder="请选择或输入分类" filterable allow-create default-first-option style="width:100%;">
            <el-option v-for="cat in uniqueCategoriesForForm" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="articleForm.content" type="textarea" :rows="6" placeholder="请输入文章内容" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="articleForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入或选择标签"
            style="width:100%;"
          >
            <el-option v-for="tag in uniqueTagsForForm" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="状态" prop="status">
                <el-select v-model="articleForm.status" placeholder="请选择状态" style="width:100%;">
                    <el-option label="Published" value="published" />
                    <el-option label="Draft" value="draft" />
                    <el-option label="Pending Review" value="pending review" />
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
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="articleForm.summary" type="textarea" :rows="3" placeholder="请输入文章摘要 (可选)" />
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
import { 
  adminArticlesState, 
  getArticles, 
  addArticle, 
  updateArticle, 
  deleteArticle,
  getUniqueCategories,
  getUniqueTags
} from '../../assets/mockNews.js'; // Ensure this path is correct

const loading = ref(false);
const allArticles = ref([]);
const filteredArticles = ref([]);

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
// For form dropdowns, we want them to update if new categories/tags are added
const uniqueCategoriesForForm = computed(() => getUniqueCategories());
const uniqueTagsForForm = computed(() => getUniqueTags());


const loadArticles = () => {
  loading.value = true;
  setTimeout(() => {
    allArticles.value = getArticles(); // Get all articles
    uniqueCategories.value = getUniqueCategories(); // For filter dropdown
    uniqueTags.value = getUniqueTags(); // For form tag dropdown
    applyFilters(); // Apply initial or existing filters
    loading.value = false;
  }, 100); // Simulate API delay
};

const applyFiltersAndLoad = () => { // Renamed to avoid conflict with auto-filter
    loadArticles(); // This will re-fetch and then apply filters
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
};

onMounted(() => {
  loadArticles();
});

const resetForm = () => {
  Object.assign(articleForm, initialFormState);
  articleForm.tags = []; // Ensure tags array is reset properly
  articleForm.publishDate = new Date().toISOString(); // Reset date to now
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
  // Deep copy row to form, ensuring tags are also copied correctly
  Object.assign(articleForm, JSON.parse(JSON.stringify(row))); 
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!articleFormRef.value) return;
  await articleFormRef.value.validate((valid) => {
    if (valid) {
      const articleData = { ...articleForm };
      // Ensure tags are an array
      if (!Array.isArray(articleData.tags)) {
        articleData.tags = articleData.tags ? String(articleData.tags).split(',').map(t => t.trim()) : [];
      }

      if (isEditing.value) {
        const updated = updateArticle(articleData);
        if (updated) {
          ElMessage.success('文章更新成功！');
        } else {
          ElMessage.error('文章更新失败。');
        }
      } else {
        const added = addArticle(articleData);
        ElMessage.success(`文章 "${added.title}" 添加成功！`);
      }
      dialogVisible.value = false;
      loadArticles(); // Refresh table and unique values for filters/forms
    } else {
      ElMessage.error('请检查表单输入。');
      return false;
    }
  });
};

const handleDelete = (articleId) => {
  const success = deleteArticle(articleId);
  if (success) {
    ElMessage.success('文章删除成功！');
    loadArticles(); // Refresh table and unique values
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
  return 'primary';
};

const getCategoryTagType = (category) => {
    // Simple hash for variety, not truly unique but good for demo
    const hash = category.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const colors = ['', 'success', 'info', 'warning', 'danger']; // Element Plus tag types
    return colors[Math.abs(hash) % colors.length];
};

// Watch filters and re-apply (optional, button click is primary way now)
// Object.keys(filters).forEach(key => {
//   watch(() => filters[key], applyFilters);
// });

</script>

<style scoped>
.article-management-page {
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
