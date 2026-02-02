
export class Handler {
  constructor(game) {
    this.game = game;
    this.resetBtn = document.getElementById("resetBtn");
    this.fullScreenBtn = document.getElementById("fullScreenBtn");
    this.arrowLeft = document.getElementById("arrowLeft");
    this.arrowRight = document.getElementById("arrowRight");
    let leftInterval;
    let rightInterval;

    this.arrowLeft.addEventListener("mousedown", () => {
      if (leftInterval) clearInterval(leftInterval);
      leftInterval = setInterval(() => {
        this.game.player.x -= this.game.player.speed;
        this.game.player.jetsFrameX = 0;
      }, 100);
    });
    this.arrowLeft.addEventListener("mouseup", () => {
      clearInterval(leftInterval);
    });
    this.arrowLeft.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (leftInterval) clearInterval(leftInterval);
      leftInterval = setInterval(() => {
        this.game.player.x -= this.game.player.speed;
        this.game.player.jetsFrameX = 0;
      }, 100);
    });
    this.arrowLeft.addEventListener("touchend", () => {
      clearInterval(leftInterval);
    });
    arrowRight.addEventListener("mousedown", () => {
      if (rightInterval) clearInterval(rightInterval);
      rightInterval = setInterval(() => {
        this.game.player.x += this.game.player.speed;
        this.game.player.jetsFrameX = 2;
      }, 100);
    });
    arrowRight.addEventListener("mouseup", () => {
      clearInterval(rightInterval);
    });
    arrowRight.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (rightInterval) clearInterval(rightInterval);
      rightInterval = setInterval(() => {
        this.game.player.x += this.game.player.speed;
        this.game.player.jetsFrameX = 2;
      }, 100);
    });
    arrowRight.addEventListener("touchend", () => {
      clearInterval(rightInterval);
    });

    this.fullScreenHandler = (e) => {
      this.toggleFullScreen();
    };
    this.resetHandler = (e) => {
      this.game.restart();

      this.game.gameOver = false;
    };
    this.resizeHandler = (e) => {
      this.game.resize(e.target.innerWidth, e.target.innerHeight);
    };

    this.fullScreenBtn.addEventListener("click", this.fullScreenHandler);
    this.resetBtn.addEventListener("click", this.resetHandler);
    window.addEventListener("resize", this.resizeHandler);

    //  window.addEventListener("keydown", (e) => {
    //    if (e.key === "1" && !this.game.fired) this.game.player.shoot();
    //    this.game.fired = true;
    //    if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
    //    if (e.key === "r" && this.game.gameOver) {
    //      this.game.restart();
    //      this.game.gameOver = false;
    //    }
    //  });
    //  window.addEventListener("keyup", (e) => {
    //    this.game.fired = false;
    //    const index = this.keys.indexOf(e.key);
    //    if (index > -1) this.keys.splice(index, 1);
    //  });
  }
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen?.();
    }
  }
  // на случай выхода из игры
  destroyListeners() {
    this.fullScreenBtn.removeEventListener("click", this.fullScreenHandler);
    this.resetBtn.removeEventListener("click", this.resetHandler);
    window.removeEventListener("resize", this.resizeHandler);

    this.fullScreenHandler = null;
    this.resetHandler = null;
    this.resizeHandler = null;
  }
}
