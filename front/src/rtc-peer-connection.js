import { pipe, curry } from '@fxts/core';
import { getMediaStream } from './media';

const peerConnectionPool = {};
const pcConfig = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun1.l.google.com:19305',
        'stun:stun2.l.google.com:19302',
        'stun:stun2.l.google.com:19305',
        'stun:stun3.l.google.com:19302',
        'stun:stun3.l.google.com:19305',
      ],
    },
  ],
};
const sdpOption = {};
const handler = {};

const createPeerConnection = id => {
  const pc = (peerConnectionPool[id] = new RTCPeerConnection(pcConfig));
  Object.entries(handler).forEach(
    ([event, handler]) => (pc[event] = handler(id)),
  );
  getMediaStream().then(stream =>
    stream.getTracks().forEach(track => pc.addTrack(track, stream)),
  );

  return pc;
};

const getPeerConnection = id => {
  if (peerConnectionPool.hasOwnProperty(id)) return peerConnectionPool[id];
  return createPeerConnection(id);
};

export const setOnIceCandidateHandler = cb => (handler.onicecandidate = cb);
export const setOnTrackHandler = cb => (handler.ontrack = cb);

export const closePeerConnection = id => {
  peerConnection[id].close();
  delete peerConnectionPool[id];
};
export const setLocalDescription = curry((id, sdp) =>
  getPeerConnection(id).setLocalDescription(sdp),
);

export const setRemoteDescription = curry((id, sdp) =>
  getPeerConnection(id).setRemoteDescription(sdp),
);

export const addIceCandidate = curry((id, candidate) =>
  getPeerConnection(id).addIceCandidate(candidate),
);

export const createOffer = id => getPeerConnection(id).createOffer(sdpOption);

export const createAnswer = id => getPeerConnection(id).createAnswer(sdpOption);
