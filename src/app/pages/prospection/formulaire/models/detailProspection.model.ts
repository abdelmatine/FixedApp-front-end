export type offre = 'FO' | 'FB' | 'FJ' | 'ADSL' | 'VDSL';

export class DetailProspection{

    
    id: number | undefined;
    offretype: offre | undefined;
    fullName: string | undefined;
    numID: number | undefined;
    contractNum: number | undefined;
    residenceName: string | undefined;
    latitude: number | undefined;
    longitude: number | undefined;

    zone: string | undefined;
    access: string | undefined;

    bloc: number | undefined;
    etage: number | undefined;
    appartement: number | undefined;

    raison: string | undefined;
    autres: string | undefined;
    
    etat: string | undefined;


}