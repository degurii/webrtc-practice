// Getting started with media devices ------------------------------------------
const constraints = {
  video: true,
  audio: true,
};
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    console.log('Got MediaStream:', stream);
  })
  .catch((error) => {
    console.error('Error accessing media devices.', error);
  });

// Querying media devices ------------------------------------------------------
function getConnectedDevices(type, callback) {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const filtered = devices.filter((device) => device.kind === type);
    callback(filtered);
  });
}

// getConnectedDevices('videoinput', (cameras) =>
//   console.log('Cameras found', cameras),
// );
navigator.mediaDevices
  .enumerateDevices()
  .then((devices) => console.log(devices));

// Listening for devices changes -----------------------------------------------
// Updates the select element with the provided set of cameras
function updateCameraList(cameras) {
  const listElement = document.querySelector('select#availableCameras');
  listElement.innerHTML = '';
  cameras
    .map((camera) => {
      const cameraOption = document.createElement('option');
      cameraOption.label = camera.label;
      cameraOption.value = camera.deviceId;
      cameraOption.innerHTML = 'hi';
      return cameraOption;
    })
    .forEach((cameraOption) => listElement.appendChild(cameraOption));
}

// Fetch an array of devices of a certain type
async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
}

// Get the initial set of cameras connected
(async () => {
  const videoCameras = await getConnectedDevices('videoinput');
  console.log('videoCameras:', videoCameras);
  updateCameraList(videoCameras);
})();

// Listen for changes to media devices and update the list accordingly
navigator.mediaDevices.addEventListener('devicechange', async (event) => {
  const newCameraList = await getConnectedDevices('videoinput');
  updateCameraList(newCameraList);
});

// Media Constraints ----------------------------------------------------------

// Open camera with at least minWidth and minHeight capabilities
async function openCamera(cameraId, minWidth, minHeight) {
  const constraints = {
    audio: { echoCancellation: true },
    video: {
      deviceId: cameraId,
      width: { min: minWidth },
      height: { min: minHeight },
    },
  };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

(async () => {
  const cameras = await getConnectedDevices('videoinput');
  if (cameras && cameras.length > 0) {
    // Open first available video camera with a resolution of 1280x720 pixels
    const stream = await openCamera(cameras[0].deviceId, 1280, 720);
    console.log(stream);
  }
})();

// // Local Playback -------------------------------------------------------------
// async function playVideoFromCamera() {
//   try {
//     const constraints = { video: true, audio: true };
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     const videoElement = document.querySelector('video#localVideo');
//     videoElement.srcObject = stream;
//   } catch (error) {
//     console.error('Error opening video camera.', error);
//   }
// }
