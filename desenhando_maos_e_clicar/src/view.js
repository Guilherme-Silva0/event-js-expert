export default class View {
  #handsCanvas = document.querySelector("#hands");
  #canvasContext = this.#handsCanvas.getContext("2d");
  #fingerLookupIndexes;

  constructor({ fingerLookupIndexes }) {
    this.#handsCanvas.width = globalThis.screen.availWidth;
    this.#handsCanvas.height = globalThis.screen.availHeight;
    this.#fingerLookupIndexes = fingerLookupIndexes;
  }

  clear() {
    this.#canvasContext.clearRect(
      0,
      0,
      this.#handsCanvas.width,
      this.#handsCanvas.height
    );
  }

  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue;
      this.#canvasContext.fillStyle =
        handedness === "Left" ? "#d2335c" : "#0099dd";
      this.#canvasContext.strokeStyle = "#fff";
      this.#canvasContext.lineWidth = 8;
      this.#canvasContext.lineJoin = "round";

      // Juntas
      this.#drawJoients(keypoints);

      //dedos
      this.#drawFingerAndHoverElements(keypoints);
    }
  }

  #drawJoients(keypoints) {
    for (const { x, y } of keypoints) {
      this.#canvasContext.beginPath();
      const newX = x - 2;
      const newY = y - 2;
      const radius = 3;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;

      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle);
      this.#canvasContext.fill();
    }
  }

  #drawFingerAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes);
    for (const finger of fingers) {
      const points = this.#fingerLookupIndexes[finger].map(
        (index) => keypoints[index]
      );
      const region = new Path2D();
      const [{ x, y }] = points;
      region.moveTo(x, y);
      for (const point of points) {
        region.lineTo(point.x, point.y);
      }
      this.#canvasContext.stroke(region);
    }
  }

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
