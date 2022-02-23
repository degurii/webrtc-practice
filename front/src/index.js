import degux from './degux/degux';
import reducer from './reducer';
import App from './view/App';

import { setupMedia } from './Media';

const store = degux.createStore(reducer);

const render = () => {
  window.requestAnimationFrame(() => {
    const $app = document.querySelector('#root');
    $app.innerHTML = '';
    $app.appendChild(App(store.getState(), store.dispatch));
  });
};

store.subscribe(render);

setupMedia(store.getState(), store.dispatch);
render();

// const $userVideo = document.querySelector('.user-video');
// const btnVideoToggle = document.querySelector('.video-toggle');
// const btnAudioToggle = document.querySelector('.audio-toggle');
// const toggleButton = (btn, state1, state2) => {
//   if (btn.value === state1.value) {
//     btn.value = state2.value;
//     btn.textContent = state2.text;
//   } else {
//     btn.value = state1.value;
//     btn.textContent = state1.text;
//   }
// };

// btnVideoToggle.addEventListener('click', ({ target }) => {
//   const isVideoOn = target.value === 'on';
//   pipe(
//     getMediaStream(),
//     stream => stream.getVideoTracks(),
//     each(track => (track.enabled = !isVideoOn)),
//   );
//   toggleButton(
//     target,
//     { value: 'on', text: '영상 끄기' },
//     { value: 'off', text: '영상 켜기' },
//   );
// });

// btnAudioToggle.addEventListener('click', ({ target }) => {
//   const isAudioOn = target.value === 'on';
//   pipe(
//     getMediaStream(),
//     stream => stream.getAudioTracks(),
//     each(track => (track.enabled = !isAudioOn)),
//   );
//   toggleButton(
//     target,
//     { value: 'on', text: '음성 끄기' },
//     { value: 'off', text: '음성 켜기' },
//   );
// });

// pipe(getMediaStream(), stream => ($userVideo.srcObject = stream));
// pipe(
//   getMediaStream(),
//   stream => stream.getAudioTracks(),
//   each(track => (track.enabled = false)),
// );
