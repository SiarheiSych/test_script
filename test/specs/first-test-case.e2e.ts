import { browserWrapper } from '../../common/element-wrapper';
import { bucketPageConstant, mainPageConstant, userCredantions } from '../../constants';
import { BucketPage } from '../pageobjects/bucket-page';
import { rpLoginPage } from '../pageobjects/login-page';
import { MainPage } from '../pageobjects/main-page';

const mainPage = new MainPage();
const bucketPage = new BucketPage();
const windowSize = {
  width: 1200,
  height: 700
};

describe('First case > checking bucket page', () => {
  const emptyBucketList = 0;
  const bucketItemsLocator = '.basket-count-items';

  before('Login to app', async () => {
    await rpLoginPage.open();
    await browserWrapper.setWindowSize(windowSize.width, windowSize.height);
    await rpLoginPage.login(userCredantions);
  });

  it('should have correct title', async () => {
    await mainPage.waitLoaded();
    const title = await mainPage.title.getTrimText();
    expect(title).toEqual(mainPageConstant.title, 'Something wrong with main Page');
  });

  it('should have empty bucket list', async () => {
    const bucketItemList = await mainPage.bucketButton.getChild(bucketItemsLocator).getTrimText();
    if (parseInt(bucketItemList) != 0) {
      await mainPage.bucketButton.click();
      await mainPage.bucketDropDownMenu.clearBucketCash.click();
      await mainPage.bucketButton.getChild(bucketItemsLocator).waitForTextToAppear();
      const secondBucketList = parseInt(await mainPage.bucketButton.getChild(bucketItemsLocator).getText());
      expect(secondBucketList).toEqual(emptyBucketList, 'Bucket is not cleared');
    } else {
      expect(parseInt(bucketItemList)).toEqual(emptyBucketList, 'Bucket is not cleared');
    }
  });

  it('should open Bucket page', async () => {
    await mainPage.bucketButton.click();
    await mainPage.bucketDropDownMenu.bucketMainPageButton.click();
    const tableName = await bucketPage.table.getTrimText();
    expect(tableName).toEqual(bucketPageConstant.tablesName, 'Something went wrong with bucket page');
  });
});
