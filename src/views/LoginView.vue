<template>
  <div class="login-page">
    <!-- 左侧图片区域 -->
    <div class="left flex-1/5 relative flex justify-center items-center">
      <!-- 背景图片上的文字 -->
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
      <!-- Logo容器 -->
      <div class="logo-container relative">
        <img src="@/assets/img/logo.png" alt="logo"/>
      </div>
    </div>

    <!-- 右侧表单区域 -->
    <div class="right flex justify-center items-center">
      <el-card class="form-wrapper w-full max-w-md px-8 py-6">
        <!-- 欢迎标题 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">欢迎登录系统</h2>
          <p class="text-gray-500 text-sm">WELCOME</p>
        </div>

        <!-- 登录表单 -->
        <el-form ref="loginForm" :model="form" :rules="rules" class="w-full">
          <!-- 用户名输入框 -->
          <el-form-item prop="username">
            <el-input
                v-model="form.username"
                placeholder="| 请输入登录账号"
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
                placeholder="| 请输入登录密码"
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


          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
                type="primary"
                class="w-full rounded-full"
                @click="handleLogin"
                :loading="loading"
                size="large"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>

          <!-- 新增：注册链接 -->
          <el-form-item class="text-center text-gray-500 mt-4">
            <el-link type="primary" @click="goRegister">
              没有账号？请注册账号
            </el-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog v-model="termsDialogVisible" title="用户协议">
      <div v-if="termsLoading" class="text-center py-10">
        <p class="mt-2 text-gray-500">加载协议内容中...</p>
      </div>
      <div v-else-if="termsContent" class="terms-content">
        <!-- 协议内容使用pre保持格式，或根据实际需求调整样式 -->
        <pre>{{ termsContent }}</pre>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        无法加载协议内容，请稍后重试
      </div>
    </el-dialog>
  </div>

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {ElMessage, ElDialog,} from 'element-plus';
import {User, Lock} from '@element-plus/icons-vue';
import {login, agreeToTerms, getTermsVersion} from '@/api/auth';

const router = useRouter();
const store = useStore();

// 状态管理（新增协议相关状态）
const loading = ref(false);
const termsLoading = ref(false); // 协议内容加载状态
const termsDialogVisible = ref(false); // 协议弹窗显示状态
const termsVersion = ref(''); // 最新协议版本
const termsContent = ref(''); // 协议内容
const loginForm = ref(null);

const form = reactive({
  username: '',
  password: '',
  agree: false
});

// 表单验证规则（不变）
const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在 6-20 个字符之间', trigger: 'blur'}
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

// 组件加载时获取最新协议（版本+内容）
onMounted(() => {
  fetchLatestTerms();
});

// 单独封装获取协议的方法（优化版本）
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

// 打开协议弹窗（优化版本）
const openTermsDialog = () => {
  // 如果未获取到协议内容，重新请求
  if (!termsContent.value) {
    fetchLatestTerms()
        .then(() => {
          termsDialogVisible.value = true;
        })
        .catch(() => {
          // 即使获取失败也打开弹窗，显示错误信息
          termsDialogVisible.value = true;
        });
  } else {
    termsDialogVisible.value = true;
  }
};

// 登录处理逻辑（简化版本）
const handleLogin = () => {
  loginForm.value.validate((valid) => {
    if (!valid) return;

    // 关键校验：确保协议版本存在
    if (!termsVersion.value) {
      ElMessage.error('未获取到有效协议版本，请刷新页面重试');
      return;
    }
    loading.value = true;
    // 执行登录
    login(form).then(loginRes => {
      if (loginRes.data.code !== 200) {
        console.log(loginRes.data)
        ElMessage.error(loginRes.data.message || '登录失败');
        return;
      }

      // 登录成功，存储token和用户信息
      const {accessToken,  user} = loginRes.data;
      console.log(loginRes.data)
      return store.dispatch('loginSuccess', {accessToken, user}).then(() => loginRes);

    })
        .then(loginRes => {
          if (!loginRes) return; // 登录失败直接返回

          // 提交协议同意状态（携带最新版本）
          if (form.agree) {
            agreeToTerms({
              version: termsVersion.value
            }).then(agreeRes => {
              if (agreeRes.data.code !== 200) {
                ElMessage.warning('协议同意状态同步失败：' + agreeRes.data.message);
              }
            });
          }

          ElMessage.success(loginRes.data.message);
          router.push('/home');
        })
        .catch(error => {
          ElMessage.error('登录失败：');
        })
        .finally(() => {
          loading.value = false;
        });
  });
};


// 跳转注册页面
const goRegister = () => {
  router.push('/register');
}

</script>
<style lang="scss" scoped>
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
  white-space: pre-wrap; // 保留换行和空格
  word-break: break-all; // 长单词换行
  color: #333;

  // 可根据协议内容结构添加自定义样式
  h3 {
    color: #1f2937;
    margin: 16px 0 8px;
  }

  p {
    margin: 8px 0;
  }
}


</style>