var myNotification = new Notify('Yo dawg!', {
  body: 'This is an awesome notification',
  notifyShow: onNotifyShow
});

function onNotifyShow() {
  console.log('notification was shown!');
}


myNotification.show();

if (!Notify.needsPermission) {
  // myNotification();
} else if (Notify.isSupported()) {
  Notify.requestPermission(onPermissionGranted, onPermissionDenied);
}

function onPermissionGranted() {
  myNotification.show();
  console.log('Permission has been granted by the user');
  // myNotification();
}

function onPermissionDenied() {
  alert('Enalbe the Permission to see web notifications');
  console.warn('Permission has been denied by the user');
}