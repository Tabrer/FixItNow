import { AuthLayout } from '@/components/AuthLayout';
import { UserAuthForm } from '@/components/UserAuthForm';

export default function UserLoginPage() {
    return (
        <AuthLayout>
            <UserAuthForm />
        </AuthLayout>
    );
}
