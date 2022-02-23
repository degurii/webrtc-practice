export default {
  qs: (sel, parent = document) => parent.querySelector(sel),
  qsa: (sel, parent = document) => parent.querySelectorAll(sel),
  el: html => {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.children[0];
  },
  on: (event, f) => els =>
    _.each(
      el => el.addEventListener(event, f),
      _.isIterable(els) ? els : [els],
    ),
};
