import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('www',{recursive:true,force:true});await mkdir('www',{recursive:true});
for(const name of ['index.html','community.js','firebase-config.js']) await copyFile(name,'www/'+name);
console.log('Assets web preparados en www/');
