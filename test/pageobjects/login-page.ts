import { UIElement } from '../../common/element-wrapper';
import { LoginPage, uiConstants, User } from '../../constants';

class RPLoginPage implements LoginPage {
  get loginPanel() {
    return UIElement.getInstance('.keyup-validation');
  }

  get nameInput() {
    return this.loginPanel.getChild('#loginform-username')
  }

  get passwordInput() {
    return UIElement.getInstance('#loginform-password');
  }

  get loginButton() {
    return UIElement.getInstance('[type="submit"]');
  }

  public open() {
    return browser.url(`https://enotes.pointschool.ru/login`);
  }

  async login(user: User) {
    await this.loginPanel.waitForElementDisplayed(uiConstants.timeouts.defaultWait);
    await this.nameInput.setValue(user.userName);
    await this.passwordInput.setValue(user.password);
    await this.loginButton.click();
  }
}

export const rpLoginPage = new RPLoginPage();
