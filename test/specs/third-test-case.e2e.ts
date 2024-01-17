import { browserWrapper } from '../../common/element-wrapper';
import { userCredantions } from '../../constants';
import { getNameAndPrice } from '../helpers/helpers';
import { rpLoginPage } from '../pageobjects/login-page';
import { MainPage } from '../pageobjects/main-page';

const mainPage = new MainPage();
const windowSize = {
  width: 1200,
  height: 700
};

describe('Third case > should add one promotional item to the bucket', () => {
  const emptyBucketList = 0;
  const bucketItemsLocator = '.basket-count-items';
  let result;
  before('Login to app', async () => {
    await rpLoginPage.open();
    await browserWrapper.setWindowSize(windowSize.width, windowSize.height);
    await rpLoginPage.login(userCredantions);
    await mainPage.waitLoaded();
  });

  it('should have empty bucket list', async () => {
    const bucketItemListValue = parseInt(await mainPage.bucketButton.getChild(bucketItemsLocator).getTrimText());
    if (bucketItemListValue != 0) {
      await mainPage.bucketButton.click();
      await mainPage.bucketDropDownMenu.clearBucketCash.click();
      await browserWrapper.refreshPage();
      await mainPage.waitLoaded();
      const value = await mainPage.bucketButton.getChild(bucketItemsLocator).getText();
      const secondBucketList = parseInt(value);
      expect(secondBucketList).toEqual(emptyBucketList, 'Bucket is not cleared');
    } else {
      expect(bucketItemListValue).toEqual(emptyBucketList, 'Bucket is not cleared');
    }
  });

  it('should add one promotional item to the bucket', async () => {
    await mainPage.onlySellItemsCheckBox.click();
    await mainPage.bucketButton.getChild(bucketItemsLocator).waitForTextToAppear();
    const elementsArray = await mainPage.getItemsList();
    result = await getNameAndPrice(elementsArray, 2);
    await mainPage.addItemToBucket(2, true);
    await browserWrapper.refreshPage();
    await mainPage.waitLoaded();
    const value = await mainPage.bucketButton.getChild(bucketItemsLocator).getText();
    const bucketItemListValue = parseInt(value);
    expect(bucketItemListValue).toEqual(1, 'Something went wrong with bucket page');
  });

  it('should open Bucket page', async () => {
    await mainPage.bucketButton.click();
    await mainPage.bucketDropDownMenu.container.waitForElementPresent();
    const getFullValue = await mainPage.bucketDropDownMenu.container.getTrimText();
    const value = getFullValue
      .replace(/Перейти в корзину|Очистить корзину/g, '')
      .replace(/\n1|\n/g, '')
      .trim();

    const fullPrice = await mainPage.bucketDropDownMenu.fullPrice.getTrimText();
    expect(value).toEqual(`${result.productName}- ${result.value}Итого к оплате: ${fullPrice}`);
  });
});
