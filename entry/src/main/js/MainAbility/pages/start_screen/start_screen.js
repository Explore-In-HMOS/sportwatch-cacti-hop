import router from '@ohos.router';

export default {
    data: {
        canvasW: 454,
        canvasH: 454,
        groundY: 260
    },

    onShow() {
        this.initializeStartScene()
    },

    initializeStartScene() {
        let drawTimeout = 50

        let runDrawing = () => {
            let startCtx = this.$refs.startCanvas.getContext('2d')
            let isCtxValid = startCtx !== undefined

            if (isCtxValid) {
                let colorBg = '#f7f7f7'
                startCtx.fillStyle = colorBg

                let cWidth = this.canvasW
                let cHeight = this.canvasH
                startCtx.fillRect(0, 0, cWidth, cHeight)

                let colorGround = '#535353'
                startCtx.fillStyle = colorGround

                let gy = this.groundY
                let gw = this.canvasW
                let gh = 2
                startCtx.fillRect(0, gy, gw, gh)

                let dinoX = 80
                let offsetH = 40
                let dinoY = this.groundY - offsetH
                this.drawMenuDino(startCtx, dinoX, dinoY)

                let cactusOffset = 100
                let cactusX = this.canvasW - cactusOffset
                let cactusOffsetH = 45
                let cactusY = this.groundY - cactusOffsetH
                let cactusW = 25
                let cactusH = 45
                this.drawMenuCactus(startCtx, cactusX, cactusY, cactusW, cactusH)
            }
        }
        setTimeout(runDrawing, drawTimeout)
    },

    startGameScreen() {
        let targetPath = 'pages/game_screen/game_screen'

        let routeParams = {}

        let routeConfig = {
            uri: targetPath,
            params: routeParams
        }

        let currentRouter = router

        let executeReplace = currentRouter.replace(routeConfig)

        return executeReplace
    },

    drawMenuDino(ctx, x, y) {
        let colorDark = '#333333'
        ctx.fillStyle = colorDark

        let hX = x + 18
        let hY = y
        let hW = 20
        let hH = 16
        ctx.fillRect(hX, hY, hW, hH)

        let colorEye = '#f7f7f7'
        ctx.fillStyle = colorEye

        let eX = x + 22
        let eY = y + 2
        let eW = 4
        let eH = 4
        ctx.fillRect(eX, eY, eW, eH)

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

        let lX = x + 10
        let lW = 6
        let lH1 = 8
        let lY1 = y + 32
        ctx.fillRect(lX, lY1, lW, lH1)

        let rX = x + 20
        let rW = 6
        let rH1 = 8
        let rY1 = y + 32
        ctx.fillRect(rX, rY1, rW, rH1)
    },

    drawMenuCactus(ctx, x, y, w, h) {
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
    }
}