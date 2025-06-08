
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Terdaftar:', registration.scope);

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r21CnsHmtrx8biyPi_E-1fsGABK_Qs_G1vPoJJqxbk')
        });
        console.log('[Push] Berhasil subscribe:', newSubscription);
      } else {
        console.log('[Push] Sudah subscribe:', subscription);
      }
    } catch (error) {
      console.error('[SW/Push] Gagal:', error);
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
