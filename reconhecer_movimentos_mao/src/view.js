export default class View {
  loop(fn) {
    requestAnimationFrame(fn);
  }
}
