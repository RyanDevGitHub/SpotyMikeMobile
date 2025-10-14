import { IToken, IUser } from './user';
export interface LoginRequestError {
  type: 'error';
  code?: number;
  error: true;
  message: string;
}
export interface LoginRequestSuccess {
  type: 'success';
  code?: number;
  error: false;
  user: IUser;
  token: IToken;
}

export interface LoginField {
  email: string;
  password: string;
}
