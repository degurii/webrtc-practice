import { curry } from '@fxts/core';

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
const eventHandler = {};
let afterCreate;
let localMediaStream;

const createPeerConnection = id => {
  const pc = (peerConnectionPool[id] = new RTCPeerConnection(pcConfig));
  afterCreate(id);
  localMediaStream
    .getTracks()
    .forEach(track => pc.addTrack(track, localMediaStream));
  Object.entries(eventHandler).forEach(([event, handler]) =>
    pc.addEventListener(event, handler(id)),
  );
  console.log(`PeerConnection[${id}] created`);
  return pc;
};

const getPeerConnection = id => {
  if (peerConnectionPool.hasOwnProperty(id)) return peerConnectionPool[id];
  return createPeerConnection(id);
};

export const setLocalMediaStream = stream => (localMediaStream = stream);
export const setOnIceCandidateHandler = cb => (eventHandler.icecandidate = cb);
export const setOnTrackHandler = cb => (eventHandler.track = cb);
export const setOnConnectionStateChangeHandler = cb =>
  (eventHandler.connectionstatechange = cb);
export const setAfterCreate = cb => (afterCreate = cb);

export const closePeerConnection = id => {
  peerConnectionPool[id].close();
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

export const addTrack = curry((id, track) =>
  getPeerConnection(id).addTrack(track),
);

export const createOffer = id => getPeerConnection(id).createOffer(sdpOption);

export const createAnswer = id => getPeerConnection(id).createAnswer(sdpOption);
