import { browserWrapper } from '../../common/element-wrapper';
import { userCredantions } from '../../constants';
import { rpLoginPage } from '../pageobjects/login-page';
import { MainPage } from '../pageobjects/main-page';

const mainPage = new MainPage();
const windowSize = {
  width: 1200,
  height: 700
};

describe('Second case > should add one non-promotional item to the bucket', () => {
  const emptyBucketList = 0;
  before('Login to app', async () => {
    await rpLoginPage.open();
    await browserWrapper.setWindowSize(windowSize.width, windowSize.height);
    await rpLoginPage.login(userCredantions);
    await mainPage.waitLoaded();
  });

  it('should have empty bucket list', async () => {
    const bucketItemListValue = parseInt(await mainPage.bucketButton.getChild('.basket-count-items').getTrimText());
    if (bucketItemListValue != 0) {
      await mainPage.bucketButton.click();
      await mainPage.bucketDropDownMenu.clearBucketCash.click();
      await mainPage.bucketButton.getChild('.basket-count-items').waitForTextToAppear();
      const secondBucketList = parseInt(await mainPage.bucketButton.getChild('.basket-count-items').getText());
      expect(secondBucketList).toEqual(emptyBucketList, 'Bucket is not cleared');
    } else {
      expect(bucketItemListValue).toEqual(emptyBucketList, 'Bucket is not cleared');
    }
  });

  it('should add one non-promotional item to the bucket', async () => {
    await mainPage.addItemToBucket(1);
    await mainPage.bucketButton.getChild('.basket-count-items').waitForTextToAppear();
    const bucketItemListValue = parseInt(await mainPage.bucketButton.getChild('.basket-count-items').getText());
    expect(bucketItemListValue).toEqual(1, 'Something went wrong with bucket page');
  });
});
