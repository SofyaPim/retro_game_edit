export class UI {
  constructor(game, context) {
    this.game = game;
    this.context = context;
    this.message1;
    this.message2;
  }
  drawStatusText(context) {
    context.save();
    context.shadowOffsetX = 4;
    context.shadowOffsetY = 2;
    context.shadowColor = "purple";
    context.font = this.smallFont + "px Impact";
    context.fillText("Score: " + this.game.score, 20, this.game.smallFont);
    context.fillText("Wave: " + this.game.waveCount, 20, this.game.smallFont * 2);
    for (let i = 0; i < this.game.player.maxLives; i++) {
      context.strokeRect(20 + 20 * i, this.game.smallFont * 3, 10, 10);
    }
    for (let i = 0; i < this.game.player.lives; i++) {
      context.fillRect(20 + 20 * i, this.game.smallFont * 3, 10, 10);
    }
    context.restore();

    //  energy
    context.save();
    this.game.player.cooldown ? (context.fillStyle = "red") : (context.fillStyle = "gold");
    for (let i = 0; i < this.game.player.energy; i++) {
      context.fillRect(20 + 2 * i, this.game.smallFont * 4, 2, 15);
    }
    context.restore();
    if (this.game.player.cooldown) {
      context.save();
      context.shadowOffsetX = 4;
      context.shadowOffsetY = 2;
      context.shadowColor = "red";
      context.fillStyle = "white";
      context.fillText("Save you energy!", 20, this.game.smallFont * 5);
      context.fillText("use only projectiles!", 20, this.game.smallFont * 6);
      context.restore();
    }
  }
  drawGameText(context) {
    if (this.game.score >= this.game.winningScore) {
      this.message1 = "You win!";
      this.message2 = "Play again press  R";
      this.game.sound.play(this.game.sound.win);
    } else if (this.game.player.lives <= 0 ) {
      this.message1 = "You lose!";
      this.message2 = "Try again press R";
      this.game.sound.play(this.game.sound.lose);
    } else {
      this.message1 = "Lets play!";
      this.message2 = "Press R to start!";
    }
    context.save();
    context.textAlign = "center";
    context.font = this.game.largeFont + "px Impact";

    context.fillText(this.message1, this.game.width * 0.5, this.game.height * 0.5);
    context.font = this.game.smallFont + "px Impact";
    context.fillText(this.message2, this.game.width * 0.5, this.game.height * 0.7);
    context.restore();
  }
  
}
