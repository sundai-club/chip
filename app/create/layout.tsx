import AuthGuard from '@/components/auth-guard';

export default function CreateLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthGuard>{children}</AuthGuard>;
}
