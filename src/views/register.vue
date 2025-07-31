<template>
  <div class="login-page">
    <!-- 左侧图片区域（与登录页保持一致） -->
    <div class="left flex-1/5 relative flex justify-center items-center">
      <div class="relative h-full inset-0 flex flex-col z-10 justify-center items-center text-white px-4">
        <div class="flex flex-col items-center w-full max-w-md">
          <h1 class="text-3xl sm:text-4xl font-extrabold mb-4 text-gradient-to-r from-cyan-300 to-blue-400 writing-mode-vertical">
            让接单快人一步
          </h1>
          <p class="text-lg sm:text-xl text-gray-200 writing-mode-vertical">
            智能匹配 · 极速响应 · 全程无忧
          </p>
        </div>
      </div>
      <div class="logo-container relative">
        <img src="@/assets/img/logo.png" alt="logo"/>
      </div>
    </div>

    <!-- 右侧表单区域（修改为注册表单） -->
    <div class="right flex justify-center items-center">
      <el-card class="form-wrapper w-full max-w-md px-8 py-6">
        <!-- 标题修改为注册 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">用户注册</h2>
          <p class="text-gray-500 text-sm">REGISTER</p>
        </div>

        <!-- 注册表单 -->
        <el-form ref="registerForm" :model="form" :rules="rules" class="w-full">
          <!-- 用户名输入框 -->
          <el-form-item prop="username">
            <el-input
                v-model="form.username"
                placeholder="| 请输入用户名"
                clearable
                size="large"
                class="rounded-full"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <User/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input
                v-model="form.password"
                type="password"
                placeholder="| 请输入密码"
                clearable
                size="large"
                class="rounded-full"
                show-password
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 邮箱输入框（新增） -->
          <el-form-item prop="email">
            <el-input
                v-model="form.email"
                type="email"
                placeholder="| 请输入邮箱"
                clearable
                size="large"
                class="rounded-full"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Message/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 手机号输入框（新增） -->
          <el-form-item prop="phone">
            <el-input
                v-model="form.phone"
                placeholder="| 请输入手机号"
                clearable
                size="large"
                class="rounded-full"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Phone/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 角色选择（隐藏，固定为0-需求方） -->
          <el-form-item v-show="false" prop="role">
            <el-input v-model="form.role" />
          </el-form-item>

          <!-- 协议同意 -->
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree" class="flex items-start">
              <span class="text-gray-600 text-sm">
                我已经阅读并同意
                <el-link type="primary" underline="never" class="mx-1" @click.stop="openTermsDialog">
                  《用户协议》
                </el-link>
                及
                <el-link type="primary" underline="never" class="mx-1">《隐私政策》</el-link>
              </span>
            </el-checkbox>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item>
            <el-button
                type="primary"
                class="w-full rounded-full"
                @click="handleRegister"
                :loading="loading"
                size="large"
            >
              {{ loading ? '注册中...' : '注册' }}
            </el-button>
          </el-form-item>

          <!-- 已有账号？请登录 -->
          <el-form-item class="text-center text-gray-500 mt-4">
            <el-link type="primary" @click="goLogin">
              已有账号？请登录
            </el-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 用户协议弹窗（复用登录页的弹窗） -->
    <el-dialog v-model="termsDialogVisible" title="用户协议">
      <div v-if="termsLoading" class="text-center py-10">
        <p class="mt-2 text-gray-500">加载协议内容中...</p>
      </div>
      <div v-else-if="termsContent" class="terms-content">
        <pre>{{ termsContent }}</pre>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        无法加载协议内容，请稍后重试
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { User, Lock, Message, Phone } from '@element-plus/icons-vue';
import { getTermsVersion, register } from '@/api/auth'; // 注意：这里使用register接口

const router = useRouter();
const store = useStore();

// 状态管理
const loading = ref(false);
const termsLoading = ref(false);
const termsDialogVisible = ref(false);
const termsVersion = ref('');
const termsContent = ref('');
const registerForm = ref(null);

// 表单数据（匹配注册数据模板）
const form = reactive({
  username: '',       // 用户名
  password: '',       // 密码
  email: '',          // 邮箱
  phone: '',          // 手机号
  role: 0,            // 固定为0-需求方
  agree: false        // 同意协议
});

// 表单验证规则（新增邮箱和手机号验证）
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2-20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6-20 个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '角色信息错误', trigger: 'blur' }
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
};

// 组件加载时获取最新协议
onMounted(() => {
  fetchLatestTerms();
});

// 获取最新协议内容
const fetchLatestTerms = () => {
  termsLoading.value = true;
  return getTermsVersion()
      .then(res => {
        if (res.data.code === 200) {
          termsVersion.value = res.data.data.version;
          termsContent.value = res.data.data.content;
          return Promise.resolve(res.data.data);
        } else {
          const errorMsg = res.data.message || '未知错误';
          ElMessage.warning('获取协议信息失败：' + errorMsg);
          return Promise.reject(new Error(errorMsg));
        }
      })
      .catch(error => {
        ElMessage.error('获取协议信息异常，请刷新页面重试');
        console.error('获取协议错误:', error);
        return Promise.reject(error);
      })
      .finally(() => {
        termsLoading.value = false;
      });
};

// 打开协议弹窗
const openTermsDialog = () => {
  if (!termsContent.value) {
    fetchLatestTerms()
        .then(() => {
          termsDialogVisible.value = true;
        })
        .catch(() => {
          termsDialogVisible.value = true;
        });
  } else {
    termsDialogVisible.value = true;
  }
};

// 注册处理逻辑
const handleRegister = () => {
  loading.value = true;
  register(form).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success(res.data.message);
      router.push('/login');
    } else {
      ElMessage.error('注册失败：' + res.message);
    }
  })
};

// 跳转到登录页面
const goLogin = () => {
  router.push('/login');
};
</script>

<style lang="scss" scoped>
/* 与登录页样式保持一致，确保视觉统一 */
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;

  .left {
    background: url("@/assets/img/bg.png") no-repeat center;
    background-size: cover;

    h1, p {
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .writing-mode-vertical {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
  }

  .right {
    flex: 1;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
}

// 协议弹窗内容样式
.terms-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  color: #333;

  h3 {
    color: #1f2937;
    margin: 16px 0 8px;
  }

  p {
    margin: 8px 0;
  }
}
</style>
