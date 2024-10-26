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

// Define the data structure for a family member
export interface FamilyMemberData {
  firstname?: string;
  lastname?: string;
  birthday?: string;
  avatar?: string;
  gender?: "M" | "F";
}

// Define relationships structure
export interface FamilyRelations {
  spouses?: string[];
  children?: string[];
  parents?: string[];
  siblings?: string[];
  [key: string]: string[] | undefined; // Allow for other potential relationship types
}

// Main FamilyMember type
export interface FamilyMember {
  id?: string;
  data: FamilyMemberData;
  rels: FamilyRelations;
}

export interface CardNode {
  data: FamilyMemberData;
}

export interface DisplayFunction extends Function {
  (d: CardNode): string;
  create_form?: string;
}
