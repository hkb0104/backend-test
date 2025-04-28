export interface User {
  id?: string;
  email: string;
  password?: string;
  username: string;
  is_admin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModelTransformation {
  rotation: number[];
  scale: number[];
  translation: number[];
}

export interface ModelEntity {
  name: string;
  skuid: string;
  url: string;
  transformations: ModelTransformation;
}

export interface Model {
  id?: string;
  userId: string;
  entities: ModelEntity[];
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}