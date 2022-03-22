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

const sendOffer = curry((to, offer) =>
  emit('offer', { to, sdp: offer, type: 'offer' }),
);

const sendAnswer = curry((to, answer) =>
  emit('answer', { to, sdp: answer, type: 'answer' }),
);

const sendCandidate = curry((to, candidate) =>
  emit('candidate', { to, candidate, type: 'candidate' }),
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

  on('join', ({ from }) => signalProcessLocalOffer(from));

  on('close', ({ from }) => {
    closePeerConnection(from);
    dispatch({ type: REMOVE_USER, payload: from });
  });

  on('candidate', ({ from, candidate, type }) =>
    addIceCandidate(from, candidate),
  );

  on('offer', ({ from, sdp: offer, type }) => {
    setRemoteDescription(from, offer);
    signalProcessLocalAnswer(from);
  });

  on('answer', ({ from, sdp: answer, type }) =>
    setRemoteDescription(from, answer),
  );

  emit('join', { type: 'join' });
});
