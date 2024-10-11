export interface CardDimensions {
  w: number;
  h: number;
  text_x: number;
  text_y: number;
  img_w: number;
  img_h: number;
  img_x: number;
  img_y: number;
}

export interface CardEditParam {
  type: string;
  placeholder: string;
  key: string;
}

export interface CardData {
  firstname?: string;
  lastname?: string;
  birthday?: string;
}

export interface CardNode {
  data: CardData;
}

export interface DisplayFunction extends Function {
  (d: CardNode): string;
  create_form?: string;
}
