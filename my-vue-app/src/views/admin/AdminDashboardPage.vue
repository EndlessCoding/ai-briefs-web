<template>
  <div class="admin-dashboard-page">
    <el-card shadow="never">
      <template #header>
        <h1>后台管理总览</h1>
      </template>
      <p>欢迎来到后台管理系统。请从左侧菜单选择一个模块进行操作。</p>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-statistic title="总资源数" :value="1250" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="待处理文章" :value="35" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="活跃订阅数" :value="2300" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ElCard, ElStatistic, ElRow, ElCol } from 'element-plus';
// Mock data or API calls would go here in a real application
</script>

<style scoped>
.admin-dashboard-page {
  padding: 20px;
}
.admin-dashboard-page h1 {
  margin-bottom: 0; /* Element card header has its own padding */
}
</style>
