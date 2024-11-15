export interface UserData {
  uid?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  project?: string;
}

export interface ProjectData {
  uid?: string;
  name?: string;
  owner?: string;
  viewers?: string[];
  members?: FamilyMember[];
}

export interface ProjectFormData {
  name: string;
}

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
  bithplace?: string;
  death_date?: string;
  gender?: string;
}

// Define relationships structure
export interface FamilyRelations {
  spouses?: string[];
  children?: string[];
  father?: string;
  mother?: string;
}

// Main FamilyMember type
export interface FamilyMember {
  id?: string;
  data: FamilyMemberData;
  rels: FamilyRelations;
  main?: boolean;
  to_add?: boolean;
}

export interface Store {
  state: {
    data: FamilyMember[];
    node_separation: number;
    level_separation: number;
    tree: any;
  };
  getData: () => FamilyMember[];
  getTree: () => any;
  methods: Record<string, any>;
  setOnUpdate: (callback: (props?: any) => void) => void;
  update: {
    tree: (props?: any) => void;
    mainId: (props?: any) => void;
    data: (props?: any) => void;
  };
}

export interface CardNode {
  data: FamilyMemberData;
}

export interface DisplayFunction extends Function {
  (d: CardNode): string;
  create_form?: string;
}
