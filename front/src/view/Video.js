import $ from '../utils/dom';

const Video = (state, dispatch, { isLocalVideo, stream }) => {
  const $video = $.el(/*html*/ `<video autoPlay width="360" height="240" />`);
  $video.classList.add(isLocalVideo ? 'local-video' : 'remote-video');
  $video.srcObject = stream;
  return $video;
};

export default Video;
