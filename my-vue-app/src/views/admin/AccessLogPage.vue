<template>
  <div class="admin-page">
    <el-card shadow="never">
      <template #header><h1>访问日志</h1></template>
      <p>这里是访问日志模块。您可以在此查看系统访问记录。</p>
      <el-empty description="访问日志功能待开发" />
    </el-card>
  </div>
</template>
<script setup>
import { ElCard, ElEmpty } from 'element-plus';
</script>
<style scoped>.admin-page { padding: 20px; } .admin-page h1 { margin-bottom: 0; }</style>
