export type Role = 'CDS' | 'RZ' | 'RR' | 'user' ;


export interface User{
    id: string;
    firstName: string;
    userName: string;
    lastName: string;
    //email: string;
    // phone: number;
    //pass: string;
    role: Role;

}