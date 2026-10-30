import {mkdir,copyFile} from 'node:fs/promises';
await mkdir(new URL('./public/',import.meta.url),{recursive:true});
await copyFile(new URL('./index.html',import.meta.url),new URL('./public/index.html',import.meta.url));
await copyFile(new URL('./offline-worker.js',import.meta.url),new URL('./public/offline-worker.js',import.meta.url));
await copyFile(new URL('../google-ads.js',import.meta.url),new URL('./public/google-ads.js',import.meta.url));
