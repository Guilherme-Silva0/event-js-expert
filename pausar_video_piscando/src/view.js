export default class View {
  #btnInit = document.querySelector("#init");
  #statusElement = document.querySelector("#status");

  enableButton() {
    this.#btnInit.disabled = false;
  }
}
