const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};

const requestPermissionAndSubscribe = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('❌ Browser tidak mendukung notifikasi push.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('❌ Izin notifikasi ditolak.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEduR6rZiz6UWA_AEjj3c6rVfktuMHThQEUMq0nM8-1j86FWM--cqc8Lp3pfw6Xw04-hJV1P2rdbkt4kpD_hBBI'
      )
    });

    console.log('✅ Subscription berhasil:', JSON.stringify(subscription));
    // Kirim subscription ke server jika diperlukan
  } catch (error) {
    console.error('❌ Gagal subscribe:', error);
  }
};

export default requestPermissionAndSubscribe;
