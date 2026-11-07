import {mkdir,copyFile,rm,readdir} from 'node:fs/promises';
await rm('www',{recursive:true,force:true});
await mkdir('www',{recursive:true});
for(const name of ['index.html','community.js','firebase-config.js']) await copyFile(name,'www/'+name);
// Los GPX se descargan durante la compilación Android: quedan dentro del APK.
try{
 const tracks=await readdir('tracks');
 await mkdir('www/tracks',{recursive:true});
 for(const name of tracks.filter(x=>x.endsWith('.gpx')))await copyFile('tracks/'+name,'www/tracks/'+name);
 console.log('Tracks GPX incorporados:',tracks.filter(x=>x.endsWith('.gpx')).join(', '));
}catch(e){if(e.code!=='ENOENT')throw e;console.log('Sin tracks locales: el sitio web usa importación manual.')}
console.log('Assets web preparados en www/');
