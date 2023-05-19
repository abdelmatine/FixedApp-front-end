import { ProspectionForm } from "./prospection.model";

export interface ProspectionFormWithoutAccess extends ProspectionForm {
    raison: string ;
    autres: string ;  
}
  
