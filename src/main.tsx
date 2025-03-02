import React from 'react';
import ReactDOM from 'react-dom/client';
import { AlertProvider } from './shared/context/AlertProvider.tsx';
import { AuthContextProvider } from './shared/context/AuthContext.tsx';

import './main.scss';
import Router from './Router.tsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthContextProvider>
            <AlertProvider>
                <Router />
            </AlertProvider>
        </AuthContextProvider>
    </React.StrictMode>
);
