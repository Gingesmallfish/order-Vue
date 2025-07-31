<template>
  <div class="footer-wrapper">
    <div class="footer-content">
      <p class="copyright">
        © {{ currentYear }} Your Company Name. All rights reserved.
      </p>
      <div class="footer-links">
        <el-link href="#" target="_blank" :underline="false" class="footer-link">关于我们</el-link>
        <el-link href="#" target="_blank" :underline="false" class="footer-link">联系我们</el-link>
        <el-link href="#" target="_blank" :underline="false" class="footer-link">隐私政策</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 显示年月日格式为"2025年7月30日"
const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

const currentYear = ref(formatDate());
</script>

<style lang="scss" scoped>
.footer-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.copyright {
  margin: 0;
  font-size: 14px;
  color: #cbd5e1;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: #cbd5e1 !important;
  font-size: 14px;

  &:hover {
    color: #ffffff !important;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
