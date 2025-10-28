#!/usr/bin/env node

import { mkdir, copyFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function build() {
    try {
        // Create local directories
        await mkdir(join(__dirname, 'components'), { recursive: true });
        await mkdir(join(__dirname, 'shared_assets'), { recursive: true });

        // Copy component
        await copyFile(
            join(__dirname, '../../components/workflow-viz.js'),
            join(__dirname, 'components/workflow-viz.js')
        );
        console.log('✓ Copied workflow-viz.js');

        // Copy shared assets
        const assets = [
            'fonts.css',
            'shared.css',
            'favicon.ico',
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon-48x48.png',
            'favicon-96x96.png',
            'favicon.svg',
            'apple-touch-icon.png',
            'site.webmanifest',
            'web-app-manifest-192x192.png',
            'web-app-manifest-512x512.png'
        ];

        for (const asset of assets) {
            await copyFile(
                join(__dirname, `../../assets/${asset}`),
                join(__dirname, `shared_assets/${asset}`)
            );
            console.log(`✓ Copied ${asset}`);
        }

        console.log('\n✅ Build complete! All files copied locally.');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
