export default class Controller {
  #view;
  #service;
  #camera;
  constructor({ camera, view, service }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
  }
  async init() {
    return this.#loop();
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);
      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        console.log(event, x, y);
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
