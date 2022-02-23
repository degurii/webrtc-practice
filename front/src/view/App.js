import $ from '../utils/dom';
import Video from './Video';

const App = (state, dispatch) => {
  const { users } = state;
  const $app = $.el(/*html*/ `
    <div class="videos">
    </div>
  `);
  users.forEach(({ stream, local }) =>
    $app.appendChild(Video(state, dispatch, { stream, isLocalVideo: local })),
  );
  return $app;
};

export default App;
