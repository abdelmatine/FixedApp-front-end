import { ProspectionForm } from "./prospection.model";

export interface ProspectionFormWithAccess extends ProspectionForm {
    bloc: number ;
    etage: number ;
    appartement: number ;  
}