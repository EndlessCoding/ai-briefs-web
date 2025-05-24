<template>
  <div class="access-log-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header-content">
          <h1>访问日志</h1>
          <el-popconfirm
            title="确定要清除所有日志吗？此操作不可恢复！"
            confirm-button-text="确定清除"
            cancel-button-text="取消"
            width="300"
            @confirm="handleClearAllLogs"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" :disabled="allLogs.length === 0">清除所有日志</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>

      <!-- Filtering/Searching -->
      <el-form :inline="true" @submit.prevent="applyFiltersAndLoad" class="filter-form">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filters.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 380px;"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
          />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="filters.userEmail" placeholder="按邮箱搜索" clearable />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="filters.action" placeholder="按操作筛选" clearable style="width: 220px;">
            <el-option v-for="(label, key) in LOG_ACTIONS_FOR_SELECT" :key="key" :label="label" :value="label" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="filters.ipAddress" placeholder="按IP搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFiltersAndLoad" :icon="Search">搜索</el-button>
          <el-button @click="resetFilters" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="paginatedLogs" style="width: 100%" v-loading="loading" default-sort='{prop: "timestamp", order: "descending"}'>
        <el-table-column prop="timestamp" label="时间戳" sortable width="190">
          <template #default="scope">{{ formatTableDateTime(scope.row.timestamp) }}</template>
        </el-table-column>
        <el-table-column prop="userEmail" label="用户邮箱" sortable width="200" show-overflow-tooltip />
        <el-table-column prop="action" label="操作类型" sortable min-width="220" show-overflow-tooltip/>
        <el-table-column prop="ipAddress" label="IP地址" sortable width="150" />
        <el-table-column prop="details" label="详情" min-width="250" show-overflow-tooltip />
      </el-table>

      <el-pagination
        v-if="totalFilteredLogs > 0"
        class="pagination-container"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalFilteredLogs"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
       <el-empty v-if="!loading && totalFilteredLogs === 0" description="暂无符合条件的日志记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'; // ElMessageBox for Popconfirm if needed, but Popconfirm is used directly
import { Delete, Search, Refresh } from '@element-plus/icons-vue';
import { 
  getAccessLogs, 
  clearAllLogs,
  LOG_ACTIONS // Import LOG_ACTIONS to populate select
} from '../../assets/mockAdminAccessLogs.js';

const loading = ref(false);
const allLogs = ref([]); // Holds all logs from the service
const filteredLogs = ref([]); // Holds logs after filtering
const paginatedLogs = ref([]); // Holds logs for the current table page

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10); // Default page size
const totalFilteredLogs = ref(0);

// Filters state
const initialFiltersState = {
  dateRange: null, // Array [startDate, endDate]
  userEmail: '',
  action: '',
  ipAddress: ''
};
const filters = reactive({ ...initialFiltersState });

// For the action filter dropdown
const LOG_ACTIONS_FOR_SELECT = computed(() => LOG_ACTIONS);


const loadLogs = () => {
  loading.value = true;
  // TODO: API Call - Fetch access logs from /api/admin/logs with filter and pagination parameters
  // The getAccessLogs() function currently simulates this.
  setTimeout(() => { 
    allLogs.value = getAccessLogs(); 
    applyFilters(); 
    loading.value = false;
  }, 100);
};

const applyFiltersAndLoad = () => {
    currentPage.value = 1; // Reset to first page on new search/filter
    loadLogs();
};

const applyFilters = () => {
  let tempLogs = [...allLogs.value];

  // Date Range Filter
  if (filters.dateRange && filters.dateRange.length === 2) {
    const [startDate, endDate] = filters.dateRange;
    tempLogs = tempLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      // Ensure dates are valid before comparing
      return logDate >= new Date(startDate) && logDate <= new Date(endDate);
    });
  }
  // User Email Filter
  if (filters.userEmail) {
    tempLogs = tempLogs.filter(log => log.userEmail.toLowerCase().includes(filters.userEmail.toLowerCase()));
  }
  // Action Filter
  if (filters.action) {
    tempLogs = tempLogs.filter(log => log.action === filters.action);
  }
  // IP Address Filter
  if (filters.ipAddress) {
    tempLogs = tempLogs.filter(log => log.ipAddress.includes(filters.ipAddress));
  }
  
  filteredLogs.value = tempLogs;
  totalFilteredLogs.value = filteredLogs.value.length;
  updatePaginatedLogs(); // Update visible logs after filtering
};

const resetFilters = () => {
  Object.assign(filters, initialFiltersState);
  applyFiltersAndLoad();
};

const updatePaginatedLogs = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  paginatedLogs.value = filteredLogs.value.slice(start, end);
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to first page
  updatePaginatedLogs();
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  updatePaginatedLogs();
};


const handleClearAllLogs = () => {
  // Confirmation is handled by el-popconfirm, this is the action on confirm
  // TODO: API Call - Send request to clear all logs at /api/admin/logs/clear (or similar)
  // The clearAllLogs() function currently simulates this.
  const success = clearAllLogs();
  if (success) {
    ElMessage.success('所有访问日志已清除！');
    loadLogs(); // Refresh the log list (it will be empty)
  } else {
    ElMessage.error('清除日志失败。'); 
  }
};

const formatTableDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', { 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false 
  });
};

onMounted(() => {
  loadLogs();
});

</script>

<style scoped>
.access-log-page {
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
.pagination-container {
  display: flex;
  justify-content: flex-end; /* Align pagination to the right */
  margin-top: 20px;
}
.el-form-item {
    margin-right: 15px; /* Add some spacing between filter items */
}
</style>
