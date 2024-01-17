import { getLogger } from 'log4js';
import { ElementsArrayHelper } from './elements-array-helper';
import { ElementParamsObj, WaitUntilOptions } from './types';
import { uiConstants } from '../../../constants/ui-constants';
import { browserWrapper } from './browser';

const logger = getLogger();

export class UIElement {
  constructor(
    private elementInstance: ReturnType<WebdriverIO.Browser['$']> | WebdriverIO.Element | Promise<WebdriverIO.Element>,
    public selector?: string
  ) {}

  get locator(): string {
    return this.selector;
  }

  static getInstance(parentSelector: string, elementParamsObj?: ElementParamsObj) {
    const childSelector = elementParamsObj?.childSelector;
    const selector = childSelector ? `${parentSelector} ${childSelector}` : `${parentSelector}`;
    logger.debug(`Create element with selector ${selector}`);
    return new UIElement($(selector), selector);
  }

  private async childInstance(childSelector: string): Promise<WebdriverIO.Element> {
    logger.debug(`Awaiting for element ${this.selector} and searching for its child ${childSelector}`);
    const element = await this.elementInstance;
    return element.$(childSelector);
  }

  getChild(childSelector: string) {
    const fullSelector = `${this.selector} ${childSelector}`;
    return new UIElement(this.childInstance(childSelector), fullSelector);
  }

  private async childArrayInstance(childSelector: string): Promise<WebdriverIO.ElementArray> {
    logger.debug(`Awaiting for element ${this.selector} and searching for its child array of elements ${childSelector}`);
    const element = await this.elementInstance;
    return element.$$(childSelector);
  }

  async getCSSProperty(property: string) {
    const element = await this.elementInstance;
    await this.waitForElementPresent();
    return element.getCSSProperty(property);
  }

  getChildArray(childSelector: string) {
    const fullSelector = `${this.selector} ${childSelector}`;
    return new ElementsArrayHelper(this.childArrayInstance(childSelector), fullSelector);
  }

  async waitForElementPresent(timeout: number = uiConstants.timeouts.defaultWait, interval: number = uiConstants.intervals.defaultInterval) {
    logger.debug(`Awaiting for element ${this.selector}`);
    const element = await this.elementInstance;
    try {
      await element.waitForExist({ timeout, interval });
    } catch (e) {
      logger.error(`Element '${this.selector}' didn't exist within timeout`);
      throw new Error(e);
    }
  }

  async waitForElementDisplayed(timeout = uiConstants.timeouts.defaultWait, interval = uiConstants.intervals.defaultInterval) {
    const element = await this.elementInstance;
    try {
      await element.waitForDisplayed({ timeout, interval });
    } catch (e) {
      logger.error(`Element '${this.selector}' was not displayed within timeout`);
      throw new Error(e);
    }
  }

  async waitForTextToAppear(options?: WaitUntilOptions) {
    const element = await this.elementInstance;

    await browserWrapper.waitUntil(async () => (await element.getText()) !== '', {
      timeoutMsg: 'Text is still absent after default timeout',
      ...options
    });
  }

  async waitForElementIsClickable(timeout = uiConstants.timeouts.defaultWait, interval = uiConstants.intervals.defaultInterval) {
    const element = await this.elementInstance;
    try {
      await element.waitForClickable({ timeout, interval });
    } catch (e) {
      logger.error(`Element '${this.selector}' was not clickable within timeout`);
      throw new Error(e);
    }
  }

  async getAttribute(attribute: string): Promise<string> {
    return (await this.elementInstance).getAttribute(attribute);
  }

  getChildInstanceAttribute(childSelector: string, attribute: string) {
    const fullSelector = `${this.selector} ${childSelector}`;
    return new UIElement(this.childInstance(childSelector), fullSelector).getAttribute(attribute);
  }

  async click() {
    const element = await this.elementInstance;
    await this.waitForElementDisplayed();
    await this.waitForElementIsClickable();
    logger.info(`Click '${this.selector}' element`);
    return element.click();
  }

  async forceClick() {
    const element = await this.elementInstance;
    await this.waitForElementDisplayed();
    logger.info(`Click '${this.selector}' element`);
    return element.click();
  }

  async rightClick() {
    const element = await this.elementInstance;
    await this.waitForElementDisplayed();
    await this.waitForElementIsClickable();
    logger.info(`Right click '${this.selector}' element`);
    return element.click({ button: 'right' });
  }

  async dragAndDrop(targetElem: UIElement) {
    const element = await this.elementInstance;
    await this.waitForElementDisplayed();
    await this.waitForElementIsClickable();
    logger.info(`dragging '${this.selector}' element`);
    return element.dragAndDrop(await targetElem.elementInstance);
  }

  async getText() {
    const element = await this.elementInstance;
    await this.waitForElementPresent();
    return element.getText();
  }

  async getTrimText() {
    const element = await this.elementInstance;
    await this.waitForElementDisplayed();
    const text = await element.getText();
    return text.trim();
  }

  async setValue(value: string, waitForClickable = true) {
    const element = await this.elementInstance;
    if (waitForClickable) {
      await this.waitForElementIsClickable();
    }
    logger.info(`Set '${value}' value into '${this.selector}' element`);
    return element.setValue(value);
  }

  async getInputValue() {
    const element = await this.elementInstance;
    await this.waitForElementPresent();
    logger.info(`Get value from '${this.selector}' element`);
    return element.getValue();
  }

  async selectByAttribute(attribute: string, value: string) {
    const element = await this.elementInstance;
    await this.waitForElementPresent();
    logger.info(`Select by '${attribute}' with '${value}' value into '${this.selector}' element`);
    await element.selectByAttribute(attribute, value);
  }

  async selectByIndex(index: number) {
    const element = await this.elementInstance;
    await this.waitForElementPresent();
    logger.info(`Select by index '${index}' from '${this.selector}' element`);
    await element.selectByIndex(index);
  }

  async hoverOverElement(options?: { [key: string]: number }) {
    const element = await this.elementInstance;
    await this.waitForElementPresent();
    logger.info(`Hover cursor over the middle of'${this.selector}' element`);
    return element.moveTo(options);
  }

  async getParentElement() {
    const element = await this.elementInstance;
    return new UIElement(element.parentElement());
  }
}
