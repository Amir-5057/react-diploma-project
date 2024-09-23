export interface IUser {
  mail: string;
  phone_number: string;
  user_id: number;
  name: string;
  reg_date: Date;
  city: string;
}

export interface IPost {
  main_text: string;
  user_id: number;
  id: number;
  reg_date: Date;
  user_fk: IUser;
  photos: [
    {
      photo_id: number;
      photo_url: string;
    }
  ];
  comments: string[];
}

export interface IGetUserResponse {
  status: number;
  message: IUser;
  
}

export interface ILoginUserResponse {
  status: 1 | 0;
  user_id: number;
  message: string;
}
export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IRegisterUserResponse extends ILoginUserResponse {}
export interface IRegisterUserPayload {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  user_city: string;
}

