import LoginPageContent from '@/components/auth/LoginPageContent';

export default function Login() {
  // 已登录用户的跳转由 middleware 统一处理
  return <LoginPageContent />;
}
