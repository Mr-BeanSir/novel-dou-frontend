import LoginPageContent from '@/components/auth/LoginPageContent';

// 强制动态渲染，因为根布局使用了 cookies
export const dynamic = 'force-dynamic';

export default function Login() {
  // 已登录用户的跳转由 middleware 统一处理
  return <LoginPageContent />;
}
