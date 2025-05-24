<template>
  <div class="admin-page">
    <el-card shadow="never">
      <template #header><h1>订阅管理</h1></template>
      <p>这里是订阅管理模块。您可以在此查看和管理用户订阅。</p>
      <el-empty description="订阅管理功能待开发" />
    </el-card>
  </div>
</template>
<script setup>
import { ElCard, ElEmpty } from 'element-plus';
</script>
<style scoped>.admin-page { padding: 20px; } .admin-page h1 { margin-bottom: 0; }</style>
