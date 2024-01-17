import { getLogger } from "log4js";
import { ElementParamsObj } from "./types";
import { UIElement } from "./elements";

const logger = getLogger();

export class ElementsArrayHelper {
  constructor(
    private elementArrayInstance:
      | Promise<WebdriverIO.ElementArray>
      | ReturnType<WebdriverIO.Browser["$$"]>,
    public selector?: string
  ) {}

  static getInstance(parentSelector: string, elementParamsObj?: ElementParamsObj) {
    const childSelector = elementParamsObj?.childSelector;
    const selector = childSelector ? `${parentSelector} ${childSelector}` : `${parentSelector}`;
    logger.debug(`Create elements array with selector ${selector}`);
    const elementArray = $$(selector);
    return new ElementsArrayHelper(elementArray, selector);
  }

  async getElementsArray(): Promise<UIElement[]> {
    return (await this.elementArrayInstance).map((el) => new UIElement(el));
  }

  async getChildElementsArray(childSelector: string): Promise<UIElement[]> {
    return (await this.elementArrayInstance).map((el) => new UIElement(el).getChild(childSelector));
  }

  private async oneElementInstanceByIndex(index: number): Promise<WebdriverIO.Element> {
    logger.debug(`Get ${index} element from array`);
    return (await this.elementArrayInstance)[index];
  }

  private async oneElementInstanceByText(text: string, containing = false) {
    const allText = await this.getAllTextsList();
    const index = containing
      ? allText.findIndex((item) => item.includes(text))
      : allText.findIndex((item) => item === text);
    if (index !== -1) {
      return (await this.elementArrayInstance)[index];
    } else {
      throw new Error(`Searched text is not found. Cannot find element with such text - ${text}`);
    }
  }

  getElementByIndex(index: number): UIElement {
    return new UIElement(this.oneElementInstanceByIndex(index));
  }

  getElementByText(text: string): UIElement {
    return new UIElement(this.oneElementInstanceByText(text));
  }

  getElementByContainingText(text: string): UIElement {
    return new UIElement(this.oneElementInstanceByText(text, true));
  }

  async getAllTextsList(firstNElements?: number): Promise<string[]> {
    let elements = await this.getElementsArray();
    if (firstNElements) {
      elements = elements.slice(0, firstNElements);
    }
    return Promise.all(elements.map((e) => e.getText()));
  }

  async getTrimText() {
    const elements = await this.getElementsArray();
    const texts: string[] = await Promise.all(elements.map((e) => e.getText()));
    return Promise.all(texts.map((text) => text.trim()));
  }

  clickByElementText(textValue: string) {
    const element = this.getElementByText(textValue);
    logger.info(`Click on element with text ${textValue}`);
    return element.click();
  }
}
