import { setupSignaling } from './signaling';
import { setOnTrackHandler } from './rtc-peer-connection';
import { getMediaStream, getEnumerateDevices } from './media';

const { pipe, toArray, each, curry } = require('@fxts/core');

setupSignaling();

const $userVideo = document.querySelector('.user-video');
const $videos = document.querySelector('.videos');
const btnVideoToggle = document.querySelector('.video-toggle');
const btnAudioToggle = document.querySelector('.audio-toggle');

const setStreamToVideo = curry(($video, stream) => {
  $video.srcObject = stream;
});

setOnTrackHandler(() => evt => {
  const $newVideo = document.createElement('video');
  $newVideo.width = 360;
  $newVideo.height = 240;
  $newVideo.autoplay = true;
  $newVideo.className = 'remote-video';
  setStreamToVideo($newVideo, evt.streams[0]);
  $videos.appendChild($newVideo);
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
    getMediaStream(),
    stream => stream.getVideoTracks(),
    each(track => (track.enabled = !isVideoOn)),
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
    getMediaStream(),
    stream => stream.getAudioTracks(),
    each(track => (track.enabled = !isAudioOn)),
  );
  toggleButton(
    target,
    { value: 'on', text: '음성 끄기' },
    { value: 'off', text: '음성 켜기' },
  );
});

pipe(getMediaStream(), setStreamToVideo($userVideo));
pipe(getEnumerateDevices(), toArray, console.log);
