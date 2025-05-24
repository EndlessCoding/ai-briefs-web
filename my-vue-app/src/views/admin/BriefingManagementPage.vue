<template>
  <div class="admin-page">
    <el-card shadow="never">
      <template #header><h1>简报管理</h1></template>
      <p>这里是简报管理模块。您可以在此创建、配置和发送新闻简报。</p>
      <el-empty description="简报管理功能待开发" />
    </el-card>
  </div>
</template>
<script setup>
import { ElCard, ElEmpty } from 'element-plus';
</script>
<style scoped>.admin-page { padding: 20px; } .admin-page h1 { margin-bottom: 0; }</style>
