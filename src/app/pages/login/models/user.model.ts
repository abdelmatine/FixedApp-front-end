export type Role = 'CDS' | 'RZ' | 'RR' | 'user' ;


export interface User1{
    id?: number;
    firstName?: string;
    userName?: string;
    lastName?: string;
    //email: string;
    // phone: number;
    //pass: string;
    //role?: Role;

}

//export type Role = 'admin' | 'premium' | 'user';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  imagePath?: string;
}