export type offre = 'FO' | 'FB' | 'FJ' | 'ADSL' | 'VDSL';

export interface ProspectionForm{

    
    offretype: offre  ;
    fullName: string ;
    numID: number ;
    contractNum: number ;
    residenceName: string ;
    latitude: number ;
    longitude: number ;

    zone: string ;
    access: boolean ;
    
    etat: string ;


}


