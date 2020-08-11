import { ServerRespond } from './DataStreamer';

/*Commented out original file code to show before and after changes
export interface Row {
  stock: string,
  top_ask_price: number,
  timestamp: Date,
}
*/

export interface Row { //the changes for the Row interface is what allows the graph to display accurately
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

/*Commented out original file code to show before and after changes
export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    return serverResponds.map((el: any) => {
      return {
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        timestamp: el.timestamp,
      };
    })
  }
}
*/

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05; //these variables determine where the horizontal bounds would appear based on their values on the y-axis
    const lowerBound = 1 - 0.05;
    return { //returning an object with key value pairs based on the schema derived from the Row interface
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp, //ternary operator for the conditional if timestamp a > timestamp b returns true, then execute/return the first time stamp, else execute/return the second timestamp
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined, //ternary operator for the conditional if either side of the comparison (||) is truthy, then execute/return the ratio, else return undefined.
    };
  }
}