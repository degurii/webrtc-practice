import { on, emit } from './websocket';
import {
  setOnIceCandidateHandler,
  closePeerConnection,
  setLocalDescription,
  setRemoteDescription,
  createOffer,
  createAnswer,
  addIceCandidate,
} from './rtc-peer-connection';
import { pipe, curry, tap } from '@fxts/core';

const sendOffer = curry((destinationSocketId, offer) =>
  emit('offer', { destinationSocketId, offer }),
);

const sendAnswer = curry((destinationSocketId, answer) =>
  emit('answer', { destinationSocketId, answer }),
);

const sendCandidate = curry((destinationSocketId, candidate) =>
  emit('candidate', { destinationSocketId, candidate }),
);

const signalLocalOffer = remoteSocketId =>
  pipe(
    remoteSocketId,
    createOffer,
    tap(setLocalDescription(remoteSocketId)),
    sendOffer(remoteSocketId),
  );

const signalLocalAnswer = remoteSocketId =>
  pipe(
    remoteSocketId,
    createAnswer,
    tap(setLocalDescription(remoteSocketId)),
    sendAnswer(remoteSocketId),
  );

export const setupSignaling = () => {
  setOnIceCandidateHandler(
    remoteSocketId => evt => (
      console.log('onicehandler:', evt),
      evt.candidate && sendCandidate(remoteSocketId, evt.candidate)
    ),
  );

  on('join', ({ sourceSocketId }) => signalLocalOffer(sourceSocketId));

  on('close', ({ sourceSocketId }) => closePeerConnection(sourceSocketId));

  on(
    'candidate',
    ({ sourceSocketId, candidate }) => (
      console.log('candidate from:', sourceSocketId),
      addIceCandidate(sourceSocketId, candidate)
    ),
  );

  on('offer', ({ sourceSocketId, offer }) => {
    setRemoteDescription(sourceSocketId, offer);
    signalLocalAnswer(sourceSocketId);
  });

  on('answer', ({ sourceSocketId, answer }) =>
    setRemoteDescription(sourceSocketId, answer),
  );

  emit('join');
};
