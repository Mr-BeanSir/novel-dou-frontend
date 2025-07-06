import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import LoginPageContent from '@/components/auth/LoginPageContent';

export default async function Login() {
  // 服务端检查认证状态
  const user = await getServerUser();
  if (user) {
    redirect('/');
  }

  // 现在通过ConditionalLayout，登录页面不会显示Header和Footer
  return <LoginPageContent />;
}
