import {firebaseConfig} from './firebase-config.js';
const $=id=>document.getElementById(id);
const status=t=>$('communityStatus').textContent=t;
if(!firebaseConfig.apiKey||!firebaseConfig.projectId){
 status('La comunidad estará disponible cuando se conecte Firebase. Las rutas personales siguen funcionando.');
}else{
 try{
 const {initializeApp}=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js');
 const {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged}=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js');
 const {getFirestore,collection,query,where,limit,getDocs,addDoc,serverTimestamp}=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js');
 const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),provider=new GoogleAuthProvider();
 const login=$('communityLogin'),logout=$('communityLogout'),share=$('communityShare'),reload=$('communityReload'),list=$('communityList');
 login.disabled=false;reload.disabled=false;
 onAuthStateChanged(auth,user=>{login.hidden=!!user;logout.hidden=!user;share.disabled=!user;status(user?'Conectado con Google. Puedes compartir una ruta.':'Explora las rutas sin iniciar sesión.');});
 login.onclick=async()=>{try{await signInWithPopup(auth,provider)}catch(e){status('No se pudo iniciar sesión: '+e.message)}};
 logout.onclick=async()=>{await signOut(auth)};
 const validPoint=p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&Math.abs(p.lat)<=90&&Math.abs(p.lon)<=180;
 const smooth=arr=>{let step=Math.max(1,Math.ceil(arr.length/900));let out=arr.filter((p,i)=>i%step===0).map(p=>({lat:+p.lat.toFixed(6),lon:+p.lon.toFixed(6),ele:Number.isFinite(p.ele)?Math.round(p.ele):null}));if(arr.length&&out.at(-1).lat!==arr.at(-1).lat)out.push(arr.at(-1));return out};
 share.onclick=async()=>{
  if(!auth.currentUser){status('Inicia sesión para publicar.');return}
  if(!selected){status('Selecciona primero una ruta de tu biblioteca.');return}
  if(!confirm('Esta ruta será pública, incluyendo su trazado completo. ¿Continuar?'))return;
  const name=prompt('Nombre público de la ruta',selected.name);if(!name||name.trim().length<3)return;
  const description=prompt('Descripción breve (máximo 500 caracteres)','')??'';
  const raw=selected.paths.flat().filter(validPoint);if(raw.length<2){status('No hay suficientes puntos válidos');return}
  try{share.disabled=true;await addDoc(collection(db,'routes'),{ownerUid:auth.currentUser.uid,name:name.trim().slice(0,100),description:description.slice(0,500),visibility:'public',points:smooth(raw),createdAt:serverTimestamp()});status('Ruta publicada para toda la comunidad.');await refresh()}catch(e){status('Error al publicar: '+e.message)}finally{share.disabled=false}
 };
 async function refresh(){
   status('Cargando rutas públicas…');list.replaceChildren();
   try{
    const snap=await getDocs(query(collection(db,'routes'),where('visibility','==','public'),limit(50)));
    if(snap.empty){list.textContent='Todavía no hay rutas públicas.';status('Comunidad disponible.');return}
    snap.docs.forEach(doc=>{
     let d=doc.data(),r=document.createElement('div');r.className='route-row';
     const info=document.createElement('div');info.className='grow';
     const title=document.createElement('strong');title.textContent=d.name||'Ruta sin nombre';
     const desc=document.createElement('span');desc.className='muted';desc.textContent=d.description||'';
     info.append(title,desc);
     const btn=document.createElement('button');btn.className='mini';btn.textContent='Guardar';
     btn.onclick=()=>{
      if(!Array.isArray(d.points)||d.points.length<2)return;
      let id='public-'+doc.id;if(routes.some(r=>r.id===id)){status('Esta ruta ya está guardada.');return}
      let points=d.points.filter(validPoint);if(points.length<2)return;
      routes.unshift({id,name:d.name||'Ruta de la comunidad',paths:[points]});
      persist();renderRoutes();showRoute(id);status('Ruta añadida a tu biblioteca local.');
     };
     r.append(info,btn);list.append(r);
    });status('Rutas públicas disponibles: '+snap.size);
   }catch(e){status('No se pudieron consultar rutas públicas: '+e.message)}
 }
 reload.onclick=refresh;await refresh();
 }catch(e){status('No se pudo iniciar Firebase: '+e.message)}
}