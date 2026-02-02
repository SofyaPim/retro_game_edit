import { Player } from "./scripts/player.js";
import { Projectile } from "./scripts/projectile.js";
import { Wave } from "./scripts/wave.js";
import { Boss } from "./scripts/boss.js";
import { Handler } from "./scripts/handlers.js";
import { UI } from "./scripts/ui.js";
import { AudioControl } from "./scripts/sounds.js";

window.addEventListener("load", function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.baseHeight = 800;
      this.ratio = this.height / this.baseHeight;
      this.keys = [];
      this.player = new Player(this);
      this.ui = new UI(this);
      this.sound = new AudioControl();

      this.projectilesPool = [];
      this.numberOfProjectiles = 15;
      this.gameOver = true;
      this.ctreateProjectiles();
      this.fired = false;

      this.columns = 1;
      this.rows = 1;
      this.enemySize = 80;

      this.waves = [];
      this.waveCount = 3;

      this.spriteUpdate = false;
      this.spriteTimer = 0;
      this.spriteInterval = 150;

      this.score = 0;
      this.winningScore = 20;

      this.smallFont;
      this.largeFont;

      this.bossArray = [];
      this.bossLives = 10;
      this.restart();
      this.handlers = new Handler(this);

      this.resize(window.innerWidth, window.innerHeight);
      this.ammo = document.getElementById("ammo");
      this.laser = document.getElementById("laser");
      this.bigLaser = document.getElementById("bigLaser");

      // shooting
      this.ammo.addEventListener("mousedown", () => {
        if (!this.fired) this.player.shoot();
      });

      this.ammo.addEventListener("touchstart", (у) => {
          e.preventDefault(); 
        if (!this.fired) this.player.shoot();
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "1" && !this.fired) this.player.shoot();
        this.fired = true;
        if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
        if (e.key === "r" && this.gameOver) {
          this.restart();
          this.gameOver = false;
        }
      });
      window.addEventListener("keyup", (e) => {
        this.fired = false;
        const index = this.keys.indexOf(e.key);
        if (index > -1) this.keys.splice(index, 1);
      });
    }

    resize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.width = width;
      this.height = height;
      this.ratio = this.height / this.baseHeight;
      ctx.strokeStyle = "white";
      ctx.fillStyle = "white";
      this.smallFont = Math.ceil(24 * this.ratio);
      this.largeFont = Math.ceil(75 * this.ratio);
      ctx.font = this.smallFont + "px Impact";
      this.player.restart();
    }
    render(context, deltaTime) {
       
      this.ui.drawStatusText(context);
      if (this.gameOver) {
        this.ui.drawGameText(context);
      }

      // sprite timing
      if (this.spriteTimer > this.spriteInterval) {
        this.spriteUpdate = true;
        this.spriteTimer = 0;
      } else {
        this.spriteUpdate = false;
        this.spriteTimer += deltaTime;
      }

      if (!this.gameOver) {
        this.player.draw(context);
        this.player.update();
      }

      this.projectilesPool.forEach((projectile) => {
        projectile.draw(context);
        projectile.update();
      });
      this.bossArray.forEach((boss) => {
        boss.draw(context);
        boss.update();
      });
      this.bossArray = this.bossArray.filter((object) => !object.markedForDeletion);

      this.waves.forEach((wave) => {
        wave.render(context);
        if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
          this.newWave();
          wave.nextWaveTrigger = true;
        }
      });
      if (this.score >= this.winningScore || this.player.lives <= 0) {
        this.ui.drawGameText(context);     
       this.gameOver = true;
      }
    }

    //   create projectiles object pool
    ctreateProjectiles() {
      for (let i = 0; i < this.numberOfProjectiles; i++) {
        this.projectilesPool.push(new Projectile());
      }
    }
    //   get free projectiles from the pool
    getProjectile() {
      for (let i = 0; i < this.projectilesPool.length; i++) {
        if (this.projectilesPool[i].free) return this.projectilesPool[i];
      }
    }
    //   collision between rectangles
    checkCollision(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    newWave() {
      this.waveCount++;
      if (this.player.lives < this.player.maxLives) this.player.lives++;
      if (this.waveCount % 3 === 0) {
        this.bossArray.push(new Boss(this, this.bossLives));
      } else {
        if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
          this.columns++;
        } else if (this.rows * this.enemySize < this.height * 0.6) {
          this.rows++;
        }
        this.waves.push(new Wave(this));
      }
      this.waves = this.waves.filter((object) => !object.markedForDeletion);
    }
    restart() {
      this.player.restart();
      this.columns = 2;
      this.rows = 2;
      this.waves = [];
      this.bossArray = [];
      this.bossLives = 10;
      this.waves.push(new Wave(this));
      this.waveCount = 1;
      this.score = 0;
      this.sound.newgame.play();
    }
  }
  const game = new Game(canvas);
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});
