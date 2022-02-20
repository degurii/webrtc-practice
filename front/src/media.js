import { pipe } from '@fxts/core';

const constraints = {
  video: true,
  audio: true,
};
let stream;

export const getMediaStream = () => {
  if (stream) return stream;
  return (stream = navigator.mediaDevices.getUserMedia(constraints));
};

export const getEnumerateDevices = () =>
  navigator.mediaDevices.enumerateDevices();
