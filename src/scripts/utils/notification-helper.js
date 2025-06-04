
function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const VAPID_PUBLIC_KEY = 'BKHn4lcc5JH_5HqZHhVevf0iG_gak65LCbr7YO3kWX2szmtBaKyzgpE9C3TL8G3AA3HdSENib6HD6iZTPA-OPeU';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) return true;

  const status = await Notification.requestPermission();
  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }
  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration?.pushManager?.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}


export async function subscribe() {
  if (!(await requestNotificationPermission())) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    alert('Service worker tidak ditemukan.');
    return;
  }

  try {
    // Hapus subscription lama jika ada
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      await existing.unsubscribe();
      console.log('🔁 Subscription lama dibatalkan.');
    }

    const newSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
    const { endpoint, keys } = newSubscription.toJSON();

    console.log('✅ Subscription berhasil:', { endpoint, keys });
    alert('Langganan push notification berhasil diaktifkan.');

    await subscribeToServer({ endpoint, keys });
  } catch (error) {
    console.error('❌ subscribe error:', error.message, error.name, error);
    alert('Langganan push notification gagal diaktifkan.');
  }
}


export async function unsubscribe() {
  const successMsg = 'Langganan push notification berhasil dinonaktifkan.';
  const failureMsg = 'Langganan push notification gagal dinonaktifkan.';

  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Belum berlangganan sebelumnya.');
      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();
    if (unsubscribed) {
      await unsubscribeFromServer(pushSubscription.endpoint);
      alert(successMsg);
    } else {
      alert(failureMsg);
    }
  } catch (error) {
    console.error('unsubscribe error:', error);
    alert(failureMsg);
  }
}


async function subscribeToServer(pushSubscription) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan');
    return;
  }

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pushSubscription)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    console.log('✅ Berhasil subscribe ke server:', data);
  } catch (err) {
    console.error('❌ Gagal subscribe ke server:', err.message);
  }
}

async function unsubscribeFromServer(endpoint) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan');
    return;
  }

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ endpoint })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    console.log('✅ Berhasil unsubscribe dari server:', data);
  } catch (err) {
    console.error('❌ Gagal unsubscribe dari server:', err.message);
  }
}
