export default {
    data: {
        dino: {
            x: 50,
            y: 300,
            w: 40,
            h: 40,
            vy: 0,
            isJumping: false
        },
        gravity: 1600,
        jumpVelocity: -650,
        groundY: 340,
        obstacles: [],
        clouds: [],
        baseSpeed: 160,
        score: 0,
        highScore: 55,
        time: 0,
        groundOffset: 0,
        gameRunning: false,
        gameOverState: false,
        canvasW: 454,
        canvasH: 454,
        spawnTimer: null,
        initialSpawnTimer: null,
        cloudTimer: null,
        lastUpdate: 0
    },

    onShow() {
        this.resetGame()
        this.startGame()
    },

    resetGame() {
        let initialX = 50
        let initialH = 40
        let initialW = 40
        let baseGround = this.groundY
        let startY = baseGround - initialH
        let startVy = 0
        let jumpState = false

        this.dino.x = initialX
        this.dino.y = startY
        this.dino.w = initialW
        this.dino.h = initialH
        this.dino.vy = startVy
        this.dino.isJumping = jumpState

        let emptyObstacles = []
        this.obstacles = emptyObstacles

        let emptyClouds = []
        this.clouds = emptyClouds

        let initialScore = 0
        this.score = initialScore

        let initialTime = 0
        this.time = initialTime

        let initialOffset = 0
        this.groundOffset = initialOffset

        let runState = true
        this.gameRunning = runState

        let overState = false
        this.gameOverState = overState

        let nowTime = Date.now()
        this.lastUpdate = nowTime
    },

    startGame() {
        let runState = true
        this.gameRunning = runState

        let nowTime = Date.now()
        this.lastUpdate = nowTime

        this.spawnLoop()
        this.spawnCloudLoop()
        this.gameLoop()
    },

    spawnCloudLoop() {
        let currentCloudTimer = this.cloudTimer
        let hasCloudTimer = currentCloudTimer !== null

        if (hasCloudTimer) {
            clearTimeout(currentCloudTimer)
        }

        const spawnCloud = () => {
            let isRunning = this.gameRunning
            if (!isRunning) {
                return
            }

            let startX = this.canvasW
            let randomYOffset = Math.random() * 150
            let startY = 50 + randomYOffset

            let newCloud = {
                x: startX,
                y: startY
            }

            this.clouds.push(newCloud)

            let baseWait = 2000
            let randomWait = Math.random() * 3000
            let totalWait = baseWait + randomWait

            this.cloudTimer = setTimeout(spawnCloud, totalWait)
        }

        spawnCloud()
    },

    spawnLoop() {
        let currentSpawnTimer = this.spawnTimer
        let hasSpawnTimer = currentSpawnTimer !== null

        if (hasSpawnTimer) {
            clearTimeout(currentSpawnTimer)
        }

        let currentInitTimer = this.initialSpawnTimer
        let hasInitTimer = currentInitTimer !== null

        if (hasInitTimer) {
            clearTimeout(currentInitTimer)
        }

        let initialDelay = 1500

        this.initialSpawnTimer = setTimeout(() => {
            let isRunning = this.gameRunning
            if (!isRunning) {
                return
            }

            const spawnObstacle = () => {
                let innerRunning = this.gameRunning
                if (!innerRunning) {
                    return
                }

                let randomHeightFactor = Math.random() * 15
                let calculatedHeight = 35 + randomHeightFactor

                let randomWidthFactor = Math.random() * 10
                let calculatedWidth = 20 + randomWidthFactor

                let startX = this.canvasW
                let baseGround = this.groundY
                let startY = baseGround - calculatedHeight

                let newObstacle = {
                    x: startX,
                    y: startY,
                    w: calculatedWidth,
                    h: calculatedHeight
                }

                this.obstacles.push(newObstacle)

                let currentTime = this.time
                let timeMultiplier = currentTime * 10

                let minBase = 1500
                let minReduced = minBase - timeMultiplier
                let minLimit = 800
                let calculatedMin = Math.max(minLimit, minReduced)

                let maxBase = 3000
                let maxReduced = maxBase - timeMultiplier
                let maxLimit = 1500
                let calculatedMax = Math.max(maxLimit, maxReduced)

                let diffInterval = calculatedMax - calculatedMin
                let randomInterval = Math.random() * diffInterval
                let finalInterval = calculatedMin + randomInterval

                this.spawnTimer = setTimeout(spawnObstacle, finalInterval)
            }

            spawnObstacle()
        }, initialDelay)
    },

    handleScreenTap() {
        let overState = this.gameOverState
        if (overState) {
            this.resetGame()
            this.startGame()
            return
        }

        let runState = this.gameRunning
        let jumpState = this.dino.isJumping
        let canJump = runState && !jumpState

        if (canJump) {
            let jVelocity = this.jumpVelocity
            this.dino.vy = jVelocity
            this.dino.isJumping = true
        }
    },

    updatePhysics(delta) {
        let currentVy = this.dino.vy
        let currentGravity = this.gravity
        let gravityEffect = currentGravity * delta
        let newVy = currentVy + gravityEffect
        this.dino.vy = newVy

        let currentY = this.dino.y
        let velocityEffect = this.dino.vy * delta
        let newY = currentY + velocityEffect
        this.dino.y = newY

        let groundLevel = this.groundY
        let dinoHeight = this.dino.h
        let targetGroundY = groundLevel - dinoHeight

        let isBelowGround = this.dino.y >= targetGroundY

        if (isBelowGround) {
            this.dino.y = targetGroundY
            this.dino.vy = 0
            this.dino.isJumping = false
        }

        let currentBaseSpeed = this.baseSpeed
        let currentTime = this.time
        let speedMultiplier = currentTime * 5
        let currentSpeed = currentBaseSpeed + speedMultiplier

        let currentOffset = this.groundOffset
        let offsetEffect = currentSpeed * delta
        let nextOffset = currentOffset + offsetEffect
        let maxOffset = 80
        let wrappedOffset = nextOffset % maxOffset
        this.groundOffset = wrappedOffset

        let timeForScore = this.time
        let rawScore = timeForScore * 10
        let flooredScore = Math.floor(rawScore)
        this.score = flooredScore

        let cloudSpeedMultiplier = 0.3
        let cloudSpeedEffect = currentSpeed * cloudSpeedMultiplier * delta

        let cloudLen = this.clouds.length
        let cloudIdx = cloudLen - 1

        while (cloudIdx >= 0) {
            let cObj = this.clouds[cloudIdx]
            let cx = cObj.x
            let nx = cx - cloudSpeedEffect
            this.clouds[cloudIdx].x = nx

            let isCloudOut = nx < -100
            if (isCloudOut) {
                this.clouds.splice(cloudIdx, 1)
            }
            cloudIdx--
        }

        let obsSpeedEffect = currentSpeed * delta
        let obsLen = this.obstacles.length
        let obsIdx = obsLen - 1

        let tolerance = 6
        let dx = this.dino.x
        let dy = this.dino.y
        let dw = this.dino.w
        let dh = this.dino.h

        let dLeft = dx + tolerance
        let dRight = dx + dw - tolerance
        let dTop = dy + tolerance
        let dBottom = dy + dh - tolerance

        while (obsIdx >= 0) {
            let oObj = this.obstacles[obsIdx]
            let ox = oObj.x
            let oy = oObj.y
            let ow = oObj.w
            let oh = oObj.h

            let nox = ox - obsSpeedEffect
            this.obstacles[obsIdx].x = nox

            let oLeft = nox + tolerance
            let oRight = nox + ow - tolerance
            let oTop = oy + tolerance
            let oBottom = oy + oh - tolerance

            let hHit = dLeft < oRight && dRight > oLeft
            let vHit = dTop < oBottom && dBottom > oTop
            let isHit = hHit && vHit

            if (isHit) {
                this.gameOver()
                return
            }

            let obsOutPoint = nox + ow
            let isObsOut = obsOutPoint < 0

            if (isObsOut) {
                this.obstacles.splice(obsIdx, 1)
            }
            obsIdx--
        }
    },

    drawPixelDino(ctx, x, y) {
        let colorDark = '#333333'
        ctx.fillStyle = colorDark

        let hX = x + 18
        let hY = y
        let hW = 20
        let hH = 16
        ctx.fillRect(hX, hY, hW, hH)

        let isDinoDead = this.gameOverState

        let colorEye = '#f7f7f7'
        ctx.fillStyle = colorEye

        if (isDinoDead) {
            let eyeP1X = x + 21
            let eyeP1Y = y + 1
            let eyeS1 = 2
            ctx.fillRect(eyeP1X, eyeP1Y, eyeS1, eyeS1)

            let eyeP2X = x + 25
            let eyeP2Y = y + 5
            ctx.fillRect(eyeP2X, eyeP2Y, eyeS1, eyeS1)

            let eyeP3X = x + 25
            let eyeP3Y = y + 1
            ctx.fillRect(eyeP3X, eyeP3Y, eyeS1, eyeS1)

            let eyeP4X = x + 21
            let eyeP4Y = y + 5
            ctx.fillRect(eyeP4X, eyeP4Y, eyeS1, eyeS1)

            let eyeP5X = x + 23
            let eyeP5Y = y + 3
            ctx.fillRect(eyeP5X, eyeP5Y, eyeS1, eyeS1)
        } else {
            let eX = x + 22
            let eY = y + 2
            let eW = 4
            let eH = 4
            ctx.fillRect(eX, eY, eW, eH)
        }

        ctx.fillStyle = colorDark
        let mX = x + 18
        let mY = y + 16
        let mW = 12
        let mH = 4
        ctx.fillRect(mX, mY, mW, mH)

        let bX = x + 8
        let bY = y + 16
        let bW = 18
        let bH = 16
        ctx.fillRect(bX, bY, bW, bH)

        let t1X = x
        let t1Y = y + 16
        let t1W = 8
        let t1H = 8
        ctx.fillRect(t1X, t1Y, t1W, t1H)

        let t2X = x + 4
        let t2Y = y + 12
        let t2W = 4
        let t2H = 4
        ctx.fillRect(t2X, t2Y, t2W, t2H)

        let aX = x + 26
        let aY = y + 20
        let aW = 6
        let aH = 4
        ctx.fillRect(aX, aY, aW, aH)

        let leftLegUp = false
        let rightLegUp = false

        let runState = this.gameRunning
        let jumpState = this.dino.isJumping
        let isOnGround = !jumpState
        let isRunningGround = runState && isOnGround

        if (isRunningGround) {
            let t = this.time
            let animVal = t * 12
            let animFloor = Math.floor(animVal)
            let step = animFloor % 2
            let isStepZero = step === 0

            if (isStepZero) {
                leftLegUp = true
            } else {
                rightLegUp = true
            }
        }

        let lX = x + 10
        let lW = 6
        let lH1 = 8
        let lH2 = 4
        let lY1 = y + 32
        let lY2 = y + 30

        if (!leftLegUp) {
            ctx.fillRect(lX, lY1, lW, lH1)
        } else {
            ctx.fillRect(lX, lY2, lW, lH2)
        }

        let rX = x + 20
        let rW = 6
        let rH1 = 8
        let rH2 = 4
        let rY1 = y + 32
        let rY2 = y + 30

        if (!rightLegUp) {
            ctx.fillRect(rX, rY1, rW, rH1)
        } else {
            ctx.fillRect(rX, rY2, rW, rH2)
        }
    },

    drawPixelCactus(ctx, x, y, w, h) {
        let colorCactus = '#387A50'
        ctx.fillStyle = colorCactus

        let thirdW = w / 3

        let mX = x + thirdW
        let mY = y
        let mW = thirdW
        let mH = h
        ctx.fillRect(mX, mY, mW, mH)

        let lX = x
        let lY = y + h * 0.3
        let lW = thirdW
        let lH = h * 0.3
        ctx.fillRect(lX, lY, lW, lH)

        let lcX = x
        let lcY = y + h * 0.3 + h * 0.2
        let lcW = thirdW * 1.5
        let lcH = thirdW
        ctx.fillRect(lcX, lcY, lcW, lcH)

        let rX = x + thirdW * 2
        let rY = y + h * 0.15
        let rW = thirdW
        let rH = h * 0.3
        ctx.fillRect(rX, rY, rW, rH)

        let rcX = x + thirdW * 1.5
        let rcY = y + h * 0.15 + h * 0.2
        let rcW = thirdW * 1.5
        let rcH = thirdW
        ctx.fillRect(rcX, rcY, rcW, rcH)
    },

    drawPixelCloud(ctx, x, y) {
        let colorCloud = '#cccccc'
        ctx.fillStyle = colorCloud

        let c1X = x + 15
        let c1Y = y
        let c1W = 30
        let c1H = 8
        ctx.fillRect(c1X, c1Y, c1W, c1H)

        let c2X = x + 30
        let c2Y = y - 8
        let c2W = 20
        let c2H = 8
        ctx.fillRect(c2X, c2Y, c2W, c2H)

        let c3X = x
        let c3Y = y + 8
        let c3W = 60
        let c3H = 8
        ctx.fillRect(c3X, c3Y, c3W, c3H)
    },

    drawGame() {
        let targetRef = this.$refs.canvas1
        let hasRef = targetRef !== undefined
        if (!hasRef) {
            return
        }

        let ctx = targetRef.getContext('2d')

        let colorBg = '#f7f7f7'
        ctx.fillStyle = colorBg
        let cw = this.canvasW
        let ch = this.canvasH
        ctx.fillRect(0, 0, cw, ch)

        let cloudList = this.clouds
        let cloudLen = cloudList.length
        let cIndex = 0

        while (cIndex < cloudLen) {
            let cl = cloudList[cIndex]
            let clx = cl.x
            let cly = cl.y
            this.drawPixelCloud(ctx, clx, cly)
            cIndex++
        }

        let colorGround = '#535353'
        ctx.fillStyle = colorGround
        let gy = this.groundY
        let gw = this.canvasW
        let gh = 2
        ctx.fillRect(0, gy, gw, gh)

        let bumpLimit = this.canvasW + 80
        let bIndex = 0

        while (bIndex < bumpLimit) {
            let offsetVal = this.groundOffset
            let calcX = bIndex - offsetVal
            let isCalcNeg = calcX < 0

            if (isCalcNeg) {
                let adjustVal = this.canvasW + 80
                calcX = calcX + adjustVal
            }

            let bumpY = this.groundY + 10
            let bumpW = 8
            let bumpH = 4
            ctx.fillRect(calcX, bumpY, bumpW, bumpH)

            bIndex = bIndex + 80
        }

        let obsList = this.obstacles
        let obsLen = obsList.length
        let oIndex = 0

        while (oIndex < obsLen) {
            let ob = obsList[oIndex]
            let obx = ob.x
            let oby = ob.y
            let obw = ob.w
            let obh = ob.h
            this.drawPixelCactus(ctx, obx, oby, obw, obh)
            oIndex++
        }

        let dinoX = this.dino.x
        let dinoY = this.dino.y
        this.drawPixelDino(ctx, dinoX, dinoY)

        let currentScore = this.score
        let strScore = String(currentScore)
        let padStr = '0000'
        let fullScoreStr = padStr + strScore
        let fsLen = fullScoreStr.length
        let fsStart = fsLen - 4
        let finalScoreText = fullScoreStr.substring(fsStart, fsLen)

        let halfW = this.canvasW / 2

        let colorTextDark = '#333333'
        ctx.fillStyle = colorTextDark

        let fontNormal = '24px'
        ctx.font = fontNormal

        let scoreX = halfW - 25
        let scoreY = 70
        ctx.fillText(finalScoreText, scoreX, scoreY)

        let colorTextLight = '#999999'
        ctx.fillStyle = colorTextLight

        let fontSmall = '18px'
        ctx.font = fontSmall

        let currentHigh = this.highScore
        let strHigh = String(currentHigh)
        let fullHighStr = padStr + strHigh
        let fhLen = fullHighStr.length
        let fhStart = fhLen - 4
        let finalHighText = `HI ${fullHighStr.substring(fhStart, fhLen)}`

        let hiX = halfW - 40
        let hiY = 100
        ctx.fillText(finalHighText, hiX, hiY)

        let overState = this.gameOverState
        if (overState) {
            let colorRedText = '#D34E45'
            ctx.fillStyle = colorRedText

            let fontGameOverTitle = '26px'
            ctx.font = fontGameOverTitle

            let textGo = 'GAME OVER'
            let textGoX = halfW - 70
            let textGoY = 190
            ctx.fillText(textGo, textGoX, textGoY)

            let colorGoScore = '#333333'
            ctx.fillStyle = colorGoScore

            let fontGoScore = '30px'
            ctx.font = fontGoScore

            let overScoreX = halfW - 35
            let overScoreY = 250
            ctx.fillText(finalScoreText, overScoreX, overScoreY)

            let colorTryAgain = '#999999'
            ctx.fillStyle = colorTryAgain

            let fontTryAgain = '16px'
            ctx.font = fontTryAgain

            let textTry = 'Try Again!'
            let textTryX = halfW - 40
            let textTryY = 290
            ctx.fillText(textTry, textTryX, textTryY)
        }
    },

    gameLoop() {
        let isRunning = this.gameRunning
        if (!isRunning) {
            return
        }

        let nowTime = Date.now()
        let lastTime = this.lastUpdate
        let timeDiff = nowTime - lastTime
        let deltaSec = timeDiff / 1000

        this.lastUpdate = nowTime

        let cTime = this.time
        let nTime = cTime + deltaSec
        this.time = nTime

        this.updatePhysics(deltaSec)
        this.drawGame()

        let checkRun = this.gameRunning
        if (!checkRun) {
            return
        }

        let afterDrawTime = Date.now()
        let elapsedDraw = afterDrawTime - nowTime

        let baseFrameTime = 16
        let rawDelay = baseFrameTime - elapsedDraw
        let finalDelay = Math.max(0, rawDelay)

        let hasLoopDef = this._gameLoopTimeout !== undefined
        if (!hasLoopDef) {
            this._gameLoopTimeout = () => {
                this.gameLoop()
            }
        }

        let loopCb = this._gameLoopTimeout
        setTimeout(loopCb, finalDelay)
    },

    gameOver() {
        let stopRun = false
        this.gameRunning = stopRun

        let startOver = true
        this.gameOverState = startOver

        let cScore = this.score
        let cHigh = this.highScore
        let isNewHigh = cScore > cHigh

        if (isNewHigh) {
            this.highScore = cScore
        }

        let cSpawnTimer = this.spawnTimer
        let hasSpawn = cSpawnTimer !== null
        if (hasSpawn) {
            clearTimeout(cSpawnTimer)
        }

        let cInitTimer = this.initialSpawnTimer
        let hasInit = cInitTimer !== null
        if (hasInit) {
            clearTimeout(cInitTimer)
        }

        let cCloudTimer = this.cloudTimer
        let hasCloud = cCloudTimer !== null
        if (hasCloud) {
            clearTimeout(cCloudTimer)
        }
    }
}