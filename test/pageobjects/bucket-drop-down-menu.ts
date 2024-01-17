import { ElementsArrayHelper, UIElement } from '../../common/element-wrapper';

export class BucketDropDownMenu {
  private bucketPageContainerLocator = '[aria-labelledby="dropdownBasket"]';
  private itemsListLocator = '.list-group-flush';
  constructor(private parentContainer: UIElement) {}

  get container() {
    return this.parentContainer.getChild(this.bucketPageContainerLocator);
  }

  get bucketMainPageButton() {
    return this.container.getChild('.btn-primary');
  }

  get clearBucketCash() {
    return this.container.getChild('.btn-danger');
  }

  get fullPrice() {
    return this.container.getChild('.basket_price');
  }

  get allItemsList() {
    return ElementsArrayHelper.getInstance(this.itemsListLocator, { childSelector: '.basket-item' });
  }
}
