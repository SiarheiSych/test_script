import { getLogger } from 'log4js';
import { uiConstants } from '../../../constants';
import { WaitUntilOptions } from './types';

const logger = getLogger('[Browser Wrapper]');

class BrowserWrapper {
  get defaultUrl(): string {
    return browser.config.baseUrl;
  }

  async navigate(path?: string, params: { overrideFullPath: boolean } | null = { overrideFullPath: false }) {
    const pageUrl = params.overrideFullPath ? path : path ? `${this.defaultUrl}${path}` : this.defaultUrl;
    logger.debug(`Opening url: ${pageUrl}`);
    return browser.url(pageUrl);
  }

  async refreshPage() {
    return browser.refresh;
  }

  async getCurrentUrl() {
    return browser.getUrl();
  }

  async pressBackspace() {
    return browser.keys('Backspace');
  }

  async pressTab() {
    return browser.keys('Tab');
  }

  async throttleNetwork(option: 'offline' | 'GPRS' | 'Regular2G' | 'Good2G' | 'Regular3G' | 'Good3G' | 'Regular4G' | 'DSL' | 'WiFi' | 'online') {
    return browser.throttle(option);
  }

  async setWindowSize(width: number, height: number) {
    return browser.setWindowSize(width, height);
  }

  async performActions(actions: object[]) {
    logger.debug('Performing custom actions');
    return browser.performActions(actions);
  }

  async waitUntil(condition: () => Promise<boolean> | boolean, options?: WaitUntilOptions) {
    return browser.waitUntil(condition, {
      interval: uiConstants.intervals.defaultInterval,
      timeout: uiConstants.timeouts.defaultWait,
      ...options
    });
  }
}

export const browserWrapper = new BrowserWrapper();
