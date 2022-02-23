import { on, emit } from './websocket';
import {
  setOnIceCandidateHandler,
  closePeerConnection,
  setLocalDescription,
  setRemoteDescription,
  createOffer,
  createAnswer,
  addIceCandidate,
  setOnTrackHandler,
  setLocalMediaStream,
  setAfterCreate,
} from './RtcPeerConnection';
import { pipe, curry, tap } from '@fxts/core';
import { ADD_USER, REMOVE_USER, UPDATE_USER } from './reducer';

const sendOffer = curry((destinationSocketId, offer) =>
  emit('offer', { destinationSocketId, offer }),
);

const sendAnswer = curry((destinationSocketId, answer) =>
  emit('answer', { destinationSocketId, answer }),
);

const sendCandidate = curry((destinationSocketId, candidate) =>
  emit('candidate', { destinationSocketId, candidate }),
);

const signalProcessLocalOffer = remoteSocketId =>
  pipe(
    remoteSocketId,
    createOffer,
    tap(setLocalDescription(remoteSocketId)),
    sendOffer(remoteSocketId),
  );

const signalProcessLocalAnswer = remoteSocketId =>
  pipe(
    remoteSocketId,
    createAnswer,
    tap(setLocalDescription(remoteSocketId)),
    sendAnswer(remoteSocketId),
  );

export const setupSignaling = curry((state, dispatch, localMediaStream) => {
  console.log('start signaling');
  setOnIceCandidateHandler(
    remoteSocketId => evt =>
      evt.candidate && sendCandidate(remoteSocketId, evt.candidate),
  );
  setOnTrackHandler(
    remoteSocketId => evt =>
      dispatch({
        type: UPDATE_USER,
        payload: { id: remoteSocketId, stream: evt.streams[0] },
      }),
  );
  setLocalMediaStream(localMediaStream);
  setAfterCreate(remoteSocketId => {
    dispatch(ADD_USER, { id: remoteSocketId });
  });

  on('join', ({ sourceSocketId }) => signalProcessLocalOffer(sourceSocketId));

  on('close', ({ sourceSocketId }) => {
    closePeerConnection(sourceSocketId);
    dispatch({ type: REMOVE_USER, payload: sourceSocketId });
  });

  on('candidate', ({ sourceSocketId, candidate }) =>
    addIceCandidate(sourceSocketId, candidate),
  );

  on('offer', ({ sourceSocketId, offer }) => {
    setRemoteDescription(sourceSocketId, offer);
    signalProcessLocalAnswer(sourceSocketId);
  });

  on('answer', ({ sourceSocketId, answer }) =>
    setRemoteDescription(sourceSocketId, answer),
  );

  emit('join');
});
