import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class ProspectionPageForm {

    private formBuilder: FormBuilder;
    private form: FormGroup;
    
    constructor(formBuilder: FormBuilder){
        this.formBuilder = formBuilder;
        this.form = this.createForm();
    }

    private createForm() : FormGroup {
        return this.formBuilder.group({
            
            offretype: ['', Validators.required],
            fulltName: ['', Validators.required],
            CIN: ['', Validators.required],
            contractNum: ['', Validators.required],
            residenceName: ['', Validators.required],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            zone: ['', Validators.required],
            access: ['', Validators.required],

            bloc: [''],
            etage: [''],
            appartement: [''],
            
            radio: ['', Validators.required],
            nonAccessReason: [''],

            etat: ['', Validators.required],
        }, {validator: this.customValidation});

    }

    getForm() : FormGroup {
        return this.form;
    }


    private customValidation(formGroup: FormGroup) {
        const access = formGroup.get('access')!.value;

        if (access === 'NON') {
            const nonAccessReason = formGroup.get('nonAccessReason')!.value;
            return nonAccessReason ? null : { nonAccessReasonRequired: true };
        } else {
            const bloc = formGroup.get('bloc')!.value;
            const etage = formGroup.get('etage')!.value;
            const appartement = formGroup.get('appartement')!.value;
            return bloc && etage && appartement ? null : { addressRequired: true };
        }
    }

}