import { UIElement } from '../../common/element-wrapper';



export async function getNameAndPrice(stringArray: UIElement[], position: number) {
  const productName = await stringArray[position].getChild('.product_name').getTrimText();
  const originValue = await stringArray[position].getChild('.product_price').getText();
  const value = originValue.replace(/(\d+\sр\.).*/, '$1');
  return { productName, value };
}

export function fullValue(value: number[], lastValue = 0) {
  return value.reduce((acc, el) => acc + el, lastValue);
}
