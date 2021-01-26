import { Logger } from '../logger/Logger';

/**
 * 适配屏幕工具类
 */
export class FitScreenUtil {
    
    // 当前设计分辨率
    private curDR: any = null;

    /**
     * 适配屏幕
     * @param canvasNode 画布节点
     */
    fitScreen(canvasNode: cc.Node) {
        if (cc.sys.isNative) {
            this.fitNativeScreen(canvasNode);
        }
        if (cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
            const resizeAction = () => {
                let cvs = canvasNode.getComponent(cc.Canvas);
                //保存原始设计分辨率，供屏幕大小变化时使用
                if (!this.curDR) {
                    this.curDR = cvs.designResolution;
                }
                let dr = this.curDR;
                let s = cc.view.getFrameSize();
                let rw = s.width;
                let rh = s.height;
                let finalW = rw;
                let finalH = rh;
                if (rw / rh > dr.width / dr.height) {
                    //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
                    //cvs.fitHeight = true;

                    //如果更长，则用定高
                    finalH = dr.height;
                    finalW = (finalH * rw) / rh;
                } else {
                    /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
                    //cvs.fitWidth = true;
                    //如果更短，则用定宽
                    finalW = dr.width;
                    finalH = (rh / rw) * finalW;
                }
                cvs.designResolution = cc.size(finalW, finalH);
                cvs.node.width = finalW;
                cvs.node.height = finalH;
            };

            window.onresize = resizeAction;
            resizeAction();
        }
    }

    /**
     * 原生适配
     * @param canvasNode 画布节点
     */
    fitNativeScreen(canvasNode: cc.Node) {
        let size = cc.view.getFrameSize();
        let aspect1 = size.height / size.width;
        let aspect2 = 16 / 9;
        var cvs = canvasNode.getComponent(cc.Canvas);
        if (!CC_BUILD)
            Logger.log(
                cc.sys.platform +
                    ':::' +
                    cc.sys.browserType +
                    '::' +
                    cc.sys.OS_IOS
            );
        if (aspect1 > aspect2 && cc.sys.OS_IOS === 'iOS') {
            cvs.fitHeight = true;
            cvs.fitWidth = true;
            Logger.log('----------iphone notch screen-----------');
            return;
        } else {
            cvs.fitHeight = false;
            cvs.fitWidth = true;
        }

        let frameSize = cc.view.getFrameSize();
        let designSize = cc.view.getDesignResolutionSize();

        if (
            frameSize.width / frameSize.height >
            designSize.width / designSize.height
        ) {
            canvasNode.width =
                (designSize.height * frameSize.width) / frameSize.height;
            canvasNode.height = designSize.height;
            canvasNode.getComponent(cc.Canvas).designResolution = cc.size(
                canvasNode.width,
                canvasNode.height
            );
        } else {
            canvasNode.width = designSize.width;
            canvasNode.height =
                (designSize.width * frameSize.height) / frameSize.width;
            canvasNode.getComponent(cc.Canvas).designResolution = cc.size(
                canvasNode.width,
                canvasNode.height
            );
        }

        //this.fitScreenBackground(node, designSize);
    }

    /**
     * 背景适配
     * @param canvasnode
     * @param designSize
     */
    fitScreenBackground(canvasnode: any, designSize: any) {
        let scaleW = canvasnode.width / designSize.width;
        let scaleH = canvasnode.height / designSize.height;

        let bgNode = canvasnode.getChildByName('background');
        if (!bgNode) return;
        let bgScale = canvasnode.height / bgNode.height;
        bgNode.width *= bgScale;
        bgNode.height *= bgScale;
        if (scaleW > scaleH) {
            bgScale = canvasnode.width / bgNode.width;
            bgNode.width *= bgScale;
            bgNode.height *= bgScale;
        }
    }
}
