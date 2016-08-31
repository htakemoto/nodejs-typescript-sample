import logger from '../utils/logger';

export default class Ping {
    delayInMilliSeconds: number = 300;

    async ping() {
        for (var i = 0; i < 10; i++) {
            await this.delay(this.delayInMilliSeconds);
            logger.info("ping %d", i);
        }
    }

    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
