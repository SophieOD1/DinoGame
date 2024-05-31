export default class Cactus {
    constructor(ctx, x, y, image, width, height) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.image = image
        this.width = width
        this.height = height
    }   

    update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio
    }


    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
} 