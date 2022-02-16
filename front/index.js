const { pipe, map, each, curry } = require('@fxts/core');

const $video = document.querySelector('#video');
const btnVideoToggle = document.querySelector('.video-toggle');
const btnAudioToggle = document.querySelector('.audio-toggle');

const constraints = {
  video: true,
  audio: true,
};
const getMediaStream = (() => {
  let stream;
  return (constraints) => {
    if (stream) return stream;
    return (stream = navigator.mediaDevices.getUserMedia(constraints));
  };
})();

const setStreamToVideo = curry(($video, stream) => {
  $video.srcObject = stream;
  $video.onloadedmetadata = ({ target }) => target.play();
});

const toggleButton = (btn, state1, state2) => {
  if (btn.value === state1.value) {
    btn.value = state2.value;
    btn.textContent = state2.text;
  } else {
    btn.value = state1.value;
    btn.textContent = state1.text;
  }
};

btnVideoToggle.addEventListener('click', ({ target }) => {
  const isVideoOn = target.value === 'on';
  pipe(
    getMediaStream(constraints),
    (stream) => stream.getVideoTracks(),
    each((track) => (track.enabled = !isVideoOn)),
  );
  toggleButton(
    target,
    { value: 'on', text: '영상 끄기' },
    { value: 'off', text: '영상 켜기' },
  );
});

btnAudioToggle.addEventListener('click', ({ target }) => {
  const isAudioOn = target.value === 'on';
  pipe(
    getMediaStream(constraints),
    (stream) => stream.getAudioTracks(),
    each((track) => (track.enabled = !isAudioOn)),
  );
  toggleButton(
    target,
    { value: 'on', text: '음성 끄기' },
    { value: 'off', text: '음성 켜기' },
  );
});

pipe(constraints, getMediaStream, setStreamToVideo($video));
