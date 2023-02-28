export default class Camera {
  constructor() {
    this.video = document.createElement("video");
  }

  static async init() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia not available`
      );
    }
    const videoConfig = {
      audio: false,
      video: {
        width: globalThis.screen.availWidth,
        height: globalThis.screen.availHeight,
        frameRate: {
          ideal: 60,
        },
        facingMode: "user",
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    const camera = new Camera();
    camera.video.srcObject = stream;

    // debug
    camera.video.id = "video-camera";
    camera.video.height = 450;
    camera.video.width = 800;
    // document.body.append(camera.video);

    //Espera pela camera
    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(camera.video);
      };
    });

    camera.video.play();

    return camera;
  }
}
