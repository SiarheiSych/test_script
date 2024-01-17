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
let result;
let fullResult;
let fullPriceExpected:number;

describe('Fifth case > should add nine promotional items to the bucket', () => {
  const bucketItemsLocator = '.basket-count-items';
  const emptyBucketList = 0;
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

  it('should add nine item with similar naming to the bucket', async () => {
    await mainPage.onlySellItemsCheckBox.click();
    await mainPage.bucketButton.getChild(bucketItemsLocator).waitForTextToAppear();
    fullResult = [];
    const elementsArray = await mainPage.getItemsList();
    for (let i = 0; i < 9; i++) {
      result = await getNameAndPrice(elementsArray, 0);
      fullResult.push(result);
      await mainPage.addItemToBucket(0, true);
    }
    const allItemsPrice = fullResult.map(el => parseInt(el.value.replace(/(\d+)\sр\./, '$1')));
    fullPriceExpected = fullValue(allItemsPrice);
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
