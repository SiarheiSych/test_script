import { UIElement } from '../../common/element-wrapper/lib/elements';
import { BasePage } from './base-page';
import { BucketDropDownMenu } from './bucket-drop-down-menu';

export class MainPage extends BasePage {
  pageUrl: '';
  private bucketLocator = '#basketContainer';
  private titleLocator = '.navbar-brand';
  private itemsListContainerLocator = '.note-list';
  get container() {
    return UIElement.getInstance('.wrap');
  }

  get header() {
    return this.container.getChild('.rounded');
  }

  get bucketButton() {
    return this.header.getChild(this.bucketLocator);
  }

  get title() {
    return UIElement.getInstance(this.titleLocator);
  }

  get itemsContainerList() {
    return UIElement.getInstance(this.itemsListContainerLocator);
  }

  get bucketDropDownMenu() {
    return new BucketDropDownMenu(UIElement.getInstance(this.bucketLocator));
  }

  get onlySellItemsCheckBox() {
    return this.container.getChild('#gridCheck');
  }

  async getItemsWithoutSellList() {
    const itemsWithoutSellLocator = this.itemsContainerList.getChildArray('.note-item:not(.hasDiscount)');
    return await Promise.all(await itemsWithoutSellLocator.getElementsArray());
  }

  async getItemsList() {
    const itemsWithoutSellLocator = this.itemsContainerList.getChildArray('.note-item');
    return await Promise.all(await itemsWithoutSellLocator.getElementsArray());
  }

  async addItemToBucket(index: number, statusList = false) {
    let item;
    if (!statusList) item = await this.getItemsWithoutSellList();
    else item = await this.getItemsList();
    await item[index].getChild('.actionBuyProduct').click();
  }
}
