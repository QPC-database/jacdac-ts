modules.ledPixel1.configure(30, undefined, 500)
forever(function () {
    modules.ledPixel1.showAnimation(
        modules.ledPixelAnimations.rainbowCycle,
        1000
    )
    pause(1000)
    modules.ledPixel1.showAnimation(
        modules.ledPixelAnimations.runningLights,
        1000
    )
    pause(1000)
    modules.ledPixel1.showAnimation(modules.ledPixelAnimations.comet, 1000)
    pause(1000)
    modules.ledPixel1.showAnimation(modules.ledPixelAnimations.sparkle, 1000)
    pause(1000)
    modules.ledPixel1.showAnimation(modules.ledPixelAnimations.colorWipe, 1000)
    pause(1000)
    modules.ledPixel1.showAnimation(
        modules.ledPixelAnimations.theatherChase,
        1000
    )
    pause(1000)
})
