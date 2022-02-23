import { setupSignaling } from './signaling';
import { pipe, tap } from '@fxts/core';
import { ADD_USER } from './reducer';

const constraints = {
  video: { width: 1080, height: 720 },
  audio: true,
};
let stream;

export const getMediaStream = () => {
  if (stream) return stream;
  return (stream = navigator.mediaDevices.getUserMedia(constraints));
};

export const setupMedia = (state, dispatch) =>
  pipe(
    getMediaStream(),
    tap(stream =>
      dispatch({ type: ADD_USER, payload: { id: null, local: true, stream } }),
    ),
    setupSignaling(state, dispatch),
  );
