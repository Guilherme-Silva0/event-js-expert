export default class View {
  loop(fn) {
    requestAnimationFrame(fn);
  }
  scrollPage(top) {
    scroll({
      top,
      behavior: "smooth",
    });
  }
}
