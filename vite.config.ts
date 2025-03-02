import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs-extra';
import path from 'path';

const symlink = (src, dest, type = 'dir') => {
    const destFull = path.resolve(__dirname, dest);
    if (!fs.existsSync(src)) {
        console.log(
            `Symlink source ${src} does not exist. Please set the REACT_CORE environment variable.`,
            src
        );
        process.exit(1);
    }

    if (fs.existsSync(destFull)) {
        fs.unlinkSync(destFull);
    }
    console.log(`Symlinking ${src} to ${destFull}`);
    fs.symlinkSync(src, destFull, type);
};

const copyDir = (src, dest) => {
    const sourceDir = path.resolve(__dirname, src);
    const destinationDir = path.resolve(__dirname, dest);
    fs.copySync(sourceDir, destinationDir, { overwrite: true });
};

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    const reactShared = process.env.REACT_SHARED;
    const s3Name = process.env.VITE_S3_NAME;
    console.log('React shared:', reactShared);
    console.log('S3 name:', s3Name);

    return {
        resolve: {
            preserveSymlinks: true,
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        plugins: [
            react(),
            {
                name: 'build-script',
                buildStart() {
                    if (command === 'serve' || command === 'build') {
                        symlink(`${reactShared}`, './src/shared');
                    }
                },
            },
        ],
        base: mode === 'production' ? `https://cdn.bighelp.ai/${s3Name}/` : '/',
        server: {
            port: 5173,
            host: '0.0.0.0',
            strictPort: true,
            hmr: {
                port: 5173,
            },
            fs: {
                strict: false, // Allow serving files outside root
            },
            allowedHosts: ['frontend'],
        },
    };
});
