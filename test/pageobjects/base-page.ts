import { UIElement, browserWrapper } from "../../common/element-wrapper";
import { uiConstants, Page } from "../../constants";

export abstract class BasePage implements Page {
  abstract pageUrl: string;
  private _container: UIElement;
  protected get container(): UIElement {
    return this._container;
  }
  protected set container(value: UIElement) {
    this._container = value;
  }

  async waitLoaded(timeout = uiConstants.timeouts.defaultWait) {
    await this.container.waitForElementDisplayed(timeout);
  }

  async navigate(): Promise<string | void> {
    await browserWrapper.navigate(this.pageUrl);
    return this.waitLoaded();
  }
}
