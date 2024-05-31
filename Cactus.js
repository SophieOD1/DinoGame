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


    // Axis-Aligned Bounding Box: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    collideWith(sprite) {
        const adjustBy = 1.4

        if(
            sprite.x < this.x + this.width / adjustBy && 
            sprite.x + sprite.width / adjustBy > this.x && 
            sprite.y < this.y + this.height / adjustBy && 
            sprite.y + sprite.height / adjustBy > this.y) {
            return true
        } else {
            return false
        }
    }
} 