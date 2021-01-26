
/**
 * 通用logger类型
 */
export class Logger {
    /**
     * 输出log
     */
    static log(...message: any) {
        if (!CC_BUILD) {
            console.log(...message);
        }
    }

    /**
     * 警告log
     */
    static warn(...message: any) {
        if (!CC_BUILD) {
            console.warn(...message);
        }
    }

    /**
     * 错误log
     */
    static error(...message: any) {
        if (!CC_BUILD) {
            console.error(...message);
        }
    }
}
