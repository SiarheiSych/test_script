import { browserWrapper, ElementsArrayHelper, UIElement } from '../../common/element-wrapper';
import { Details, uiConstants } from '../../constants';
import { MainPage } from './main-page';

export class BucketPage extends MainPage {
  pageUrl = `${this.pageUrl}/backet`;
  private containerLocator = '.container';
  private tableLocator = '.site-error'


  get container() {
    return UIElement.getInstance(this.containerLocator);
  }


  get table() {
    return this.container.getChild(this.tableLocator)
  }

}
