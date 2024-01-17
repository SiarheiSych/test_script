import { browserWrapper } from '../../common/element-wrapper';
import { bucketPageConstant, userCredantions } from '../../constants';
import { fullValue, getNameAndPrice } from '../helpers/helpers';
import { BucketPage } from '../pageobjects/bucket-page';
import { rpLoginPage } from '../pageobjects/login-page';
import { MainPage } from '../pageobjects/main-page';

const mainPage = new MainPage();
const bucketPage = new BucketPage();
const windowSize = {
  width: 1200,
  height: 700
};

describe('Fourth case > should add nine items to the bucket', () => {
  const bucketItemsLocator = '.basket-count-items';
  let result;
  let lastValue: number;
  let fullPriceExpected: number;
  let fullResult;
  before('Login to app', async () => {
    await rpLoginPage.open();
    await browserWrapper.setWindowSize(windowSize.width, windowSize.height);
    await rpLoginPage.login(userCredantions);
    await mainPage.waitLoaded();
  });

  it('should have one item in bucket list', async () => {
    const bucketItemListValue = parseInt(await mainPage.bucketButton.getChild(bucketItemsLocator).getTrimText());
    if (bucketItemListValue != 1) {
      await mainPage.bucketButton.click();
      await mainPage.bucketDropDownMenu.clearBucketCash.click();
      await mainPage.addItemToBucket(0, true);
      await mainPage.bucketButton.click();
      const value = await mainPage.bucketDropDownMenu.fullPrice.getTrimText();
      lastValue = parseInt(value);
      const secondBucketList = parseInt(await mainPage.bucketButton.getChild(bucketItemsLocator).getText());
      expect(secondBucketList).toEqual(1, 'Bucket includes incorrect value of items');
    } else {
      expect(bucketItemListValue).toEqual(1, 'Bucket includes incorrect value of items');
    }
  });

  it('should add nine item to the bucket', async () => {
    const itemsNumber = [0, 1, 2, 3, 4, 5, 6, 7];
    await mainPage.bucketButton.getChild(bucketItemsLocator).waitForTextToAppear();
    fullResult = [];
    const elementsArray = await mainPage.getItemsList();
    for (let i = 0; i < itemsNumber.length; i++) {
      result = await getNameAndPrice(elementsArray, i);
      fullResult.push(result);
      await mainPage.addItemToBucket(i, true);
    }
    const allItemsPrice = fullResult.map(el => parseInt(el.value.replace(/(\d+)\sр\./, '$1')));
    fullPriceExpected = fullValue(allItemsPrice, lastValue);
    await mainPage.bucketButton.getChild(bucketItemsLocator).waitForElementPresent();
    const value = await mainPage.bucketButton.getChild(bucketItemsLocator).getText();
    const bucketItemListValue = parseInt(value);
    expect(bucketItemListValue).toEqual(9, 'Something went wrong with bucket page');
  });

  it('should open Bucket page and check information', async () => {
    await mainPage.bucketButton.click();

    const fullInformation = await mainPage.bucketDropDownMenu.allItemsList.getElementsArray();
    for (let i = 0; i < fullInformation.length; i++) {
      const itemName = await fullInformation[i].getChild('.basket-item-title').getTrimText();
      const itemPrice = await fullInformation[i].getChild('.basket-item-price').getTrimText();
      expect(`${itemName}${itemPrice}`).toEqual(`${fullResult.productName} - ${fullResult.value}`);
    }
  });

  it('should check full value price', async () => {
    const fullPriceActual = await mainPage.bucketDropDownMenu.fullPrice.getTrimText();
    expect(parseInt(fullPriceActual)).toEqual(fullPriceExpected);
  });

  it('should navigate to bucket page', async () => {
    await mainPage.bucketDropDownMenu.bucketMainPageButton.click();
    const tableName = await bucketPage.table.getTrimText();
    expect(tableName).toEqual(bucketPageConstant.tablesName, 'Something went wrong with bucket page');
  });
});
