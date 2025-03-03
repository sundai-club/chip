import { useState, useEffect } from 'react';
import {
    AuthChangeRedirector,
    AnonymousRoute,
    AuthenticatedRoute,
} from './shared/routing';
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import Login from './shared/pages/Login';
import RequestLoginCode from './shared/pages/RequestLoginCode';
import ConfirmLoginCode from './shared/pages/ConfirmLoginCode';
import Logout from './shared/pages/Logout';
import Signup from './shared/pages/Signup';
import ProviderSignup from './shared/pages/ProviderSignup';
import ProviderCallback from './shared/pages/ProviderCallback';
import SettingsPage from './pages/Settings';
import ChangeEmail from './shared/pages/ChangeEmail';
import ManageProviders from './shared/pages/ManageProviders';
import VerifyEmail, {
    loader as verifyEmailLoader,
} from './shared/pages/VerifyEmail';
import VerifyEmailByCode from './shared/pages/VerifyEmailByCode';
import VerificationEmailSent from './shared/pages/VerificationEmailSent';
import RequestPasswordReset from './shared/pages/RequestPasswordReset';
import ChangePassword from './shared/pages/ChangePassword';
import ResetPassword, {
    loader as resetPasswordLoader,
} from './shared/pages/ResetPassword';
import Reauthenticate from './shared/pages/Reauthenticate';
import Sessions from './shared/pages/Sessions';
import { useConfig } from './shared/hooks/authHooks';
import HomePage from './pages/HomePage';
import CreateTaskPage from './pages/CreateTask';
import TaskDetailPage from './pages/TaskDetail';

function createRouter(config: any) {
    console.log('Creating router with config:', config);
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <AuthChangeRedirector>
                    <Outlet />
                </AuthChangeRedirector>
            ),
            errorElement: <div>Something went wrong!</div>,
            children: [
                {
                    path: '/',
                    element: (
                        <AuthenticatedRoute>
                            <HomePage />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/settings',
                    element: (
                        <AuthenticatedRoute>
                            <SettingsPage />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/account/login',
                    element: (
                        <AnonymousRoute>
                            <Login />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: '/account/login/code',
                    element: (
                        <AnonymousRoute>
                            <RequestLoginCode />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: '/account/login/code/confirm',
                    element: (
                        <AnonymousRoute>
                            <ConfirmLoginCode />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: '/account/email',
                    element: (
                        <AuthenticatedRoute>
                            <ChangeEmail />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/account/logout',
                    element: <Logout />,
                },
                {
                    path: '/account/provider/callback',
                    element: <ProviderCallback />,
                },
                {
                    path: '/account/provider/signup',
                    element: (
                        <AnonymousRoute>
                            <ProviderSignup />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: '/account/providers',
                    element: (
                        <AuthenticatedRoute>
                            <ManageProviders />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/account/signup',
                    element: (
                        <AnonymousRoute>
                            <Signup />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: '/account/verify-email',
                    element: config.data.account
                        .email_verification_by_code_enabled ? (
                        <VerifyEmailByCode />
                    ) : (
                        <VerificationEmailSent />
                    ),
                },
                {
                    path: '/account/verify-email/:key',
                    element: <VerifyEmail />,
                    loader: verifyEmailLoader,
                },
                {
                    path: '/account/password/reset',
                    element: (
                        <AnonymousRoute>
                            <RequestPasswordReset />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: '/account/password/reset/key/:key',
                    element: (
                        <AnonymousRoute>
                            <ResetPassword />
                        </AnonymousRoute>
                    ),
                    loader: resetPasswordLoader,
                },
                {
                    path: '/account/password/change',
                    element: (
                        <AuthenticatedRoute>
                            <ChangePassword />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/account/reauthenticate',
                    element: (
                        <AuthenticatedRoute>
                            <Reauthenticate />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/account/sessions',
                    element: (
                        <AuthenticatedRoute>
                            <Sessions />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/tasks/create',
                    element: (
                        <AuthenticatedRoute>
                            <CreateTaskPage />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: '/tasks/:id',
                    element: (
                        <AuthenticatedRoute>
                            <TaskDetailPage />
                        </AuthenticatedRoute>
                    ),
                    errorElement: <div>Error loading task!</div>,
                },
            ],
        },
    ]);
    console.log('Router created successfully');
    return router;
}

export default function Router() {
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);
    const config = useConfig();

    useEffect(() => {
        console.log('Router effect running, config:', config);
        if (!config) {
            console.log('No config available yet');
            return;
        }
        try {
            const newRouter = createRouter(config);
            console.log('Setting new router');
            setRouter(newRouter);
        } catch (error) {
            console.error('Error creating router:', error);
        }
    }, [config]);

    if (!router) {
        console.log('Router not initialized yet');
        return <div>Loading...</div>;
    }

    console.log('Rendering RouterProvider');
    return <RouterProvider router={router} />;
}
