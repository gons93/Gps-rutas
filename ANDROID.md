# GPS Rutas — Android + Web

La web sigue publicada desde la rama main con GitHub Pages. La aplicación Android se empaqueta desde los mismos archivos web.

## Preparar APK en Windows
1. Instalar Node.js 22+, Android Studio con Android SDK y JDK compatible con Capacitor 8.
2. Clonar este repositorio y abrir terminal en él.
3. Ejecutar `npm install`.
4. Ejecutar `npm run android:init` solo la primera vez (crea la carpeta android/).
5. Ejecutar `npm run android:open` y generar APK de depuración desde Android Studio.
6. Al cambiar la web: `npm run android:sync` y reconstruir.

**Importante:** todavía no incorpora un servicio Android de GPS en segundo plano; al bloquear el móvil, la grabación puede interrumpirse. Debe integrarse un plugin nativo con servicio en primer plano, permisos y notificación permanente antes de considerar fiable el registro con pantalla apagada.

## Firebase
Configurar `firebase-config.js` y activar Authentication/Google, Firestore y dominios autorizados tanto para el origen web como para Android. Las reglas preparadas están en `firestore.rules` y deben aplicarse manualmente en Firebase Console.

## Publicación
Para Google Play hay que probar en dispositivos, firmar una versión release y completar ficha, política de privacidad, declaración de permisos de ubicación y Data Safety. AdMob se integra solo cuando exista una versión Android probada; evitar anuncios sobre la pantalla de navegación.
