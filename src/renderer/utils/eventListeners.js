// generate listener that listens enter(13) key and move to `route`
export const EnterMoveListener = (event, router, route) => {
  const listener = (e) => {
    if (e.keyCode === 13) {
      window.removeEventListener(event, listener);
      router.push(route);
    }
  };
  return listener;
};
