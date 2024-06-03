export interface Category {
  id: string;
  name: string;
  order: number;
  items: Item[];
}
export interface Item {
  id: string;
  name: string;
  quantity: number;
  measurement: Measurement;
  checked: boolean;
  order: number;
  category_id: string;
}

export enum Measurement {
  NONE = "NONE",
  COUNT = "COUNT",
  G = "G",
  ML = "ML",
}
