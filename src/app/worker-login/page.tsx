import { AuthLayout } from '@/components/AuthLayout';
import { WorkerAuthForm } from '@/components/WorkerAuthForm';

export default function WorkerLoginPage() {
    return (
        <AuthLayout>
            <WorkerAuthForm />
        </AuthLayout>
    );
}
