import { prepareRunChecker } from "../../lib/shared/util.js";

const { shouldRun: scrollShouldRun } = prepareRunChecker({ timerDelay: 290 });
const { shouldRun: clickShouldRun } = prepareRunChecker({ timerDelay: 600 });
export default class Controller {
  #view;
  #service;
  #camera;
  #lastDirection = {
    direction: "",
    y: 0,
  };
  constructor({ camera, view, service }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
  }
  async init() {
    return this.#loop();
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 100;
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y =
        direction === "scroll-down"
          ? this.#lastDirection.y + pixelsPerScroll
          : this.#lastDirection.y - pixelsPerScroll;
    } else {
      this.#lastDirection.direction = direction;
    }
    this.#view.scrollPage(this.#lastDirection.y);
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);
      this.#view.clear();
      if (hands?.length) this.#view.drawResults(hands);
      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        if (!clickShouldRun()) continue;
        if (event === "click") {
          this.#view.clickOnElement(x, y);
          continue;
        }

        if (event.includes("scroll")) {
          if (!scrollShouldRun()) continue;
          this.#scrollPage(event);
        }
      }
    } catch (error) {
      console.error("Deu ruim**", error);
    }
  }

  async #loop() {
    await this.#service.initializeDetector();
    await this.#estimateHands();
    this.#view.loop(this.#loop.bind(this));
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    return controller.init();
  }
}
