import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import SignaturePad from 'signature_pad';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-fast-box',
  templateUrl: './fast-box.page.html',
  styleUrls: ['./fast-box.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class FastBoxPage implements OnInit {
  submissionType: any ;
  signatureImage!: string;


  source : string | undefined;
  productType!:string;
  @ViewChild('signaturePad') signaturePad: any;

  private signaturePadOptions: Object = { // options de signature_pad
    backgroundColor: '#ffffff',
    penColor: '#000000',
    minWidth: 2,
    maxWidth: 4,
  };
  private canvas: any;
  private signaturePadInstance: any;

  selectedSubscription: any;
  serialNumber: any;
  selectedDebit: any;
  isSemestrielle: boolean = false;
  isMensuelle: boolean = false;
  isAnnuelle: boolean = false;
  prospector: FormGroup ;
  verificationError: boolean = false;
  verificationResult: boolean | null = null;
verificationResultMessage: string = '';


  subscriptions = [
    'Fast Box 1P/2P : annuelle/semestrielle',
    'Fast Box Jdid / Fast+ Box : mensuelle'
  ];

  debits = [
    '8G',
    '12G'
  ];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router

  ) {
    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
    });

    this.prospector = this.formBuilder.group({
      debit: ['', Validators.required],
      abonnement: ['', Validators.required],
      categorie: ['', Validators.required],
      numeroTT: ['', Validators.required],
      numeroserie:['', Validators.required],
      msisdn: ['', Validators.required],
      prix: ['', Validators.required],
      clientPossedeNumero:['', Validators.required],
      signature_image:['', Validators.required]

    });
  }


  Verifier() {
    const numeroTT = this.prospector.controls['numeroTT'].value;
    if (numeroTT) {
      this.http.get<boolean>(`http://localhost:8080/FastBox/verify/${numeroTT}`).subscribe( response => {
          if (response) {
            alert('Le client possède une ligne.');
          } else {
            alert('Le client ne possède pas de ligne.');
          }
        },
        error => {
          alert('Une erreur s\'est produite lors de la vérification de la ligne.');
        }
      );
    } else {
      alert('Veuillez fournir un numéro de TT.');
    }
  }
submitForm(){

}
  ngOnInit() {
    console.log(this.source);
  }



  selectedAbonnement() {

    }

  onSelectionChange(){}
  Suivant(){
    const formData = this.prospector.value;

    this.http.post('http://localhost:8080/FastBox/ajouter', formData)
    .subscribe(response => {
      // Traitement de la réponse du backend
      alert('Données enregistrées avec succès !');
      // Ajoutez ici votre logique supplémentaire après l'enregistrement des données
    }, error => {
      alert('Erreur');
    });
  }
  ngAfterViewInit() {

    this.canvas = this.signaturePad.nativeElement;
    this.signaturePadInstance = new SignaturePad(this.canvas, this.signaturePadOptions);

    this.canvas.ontouchstart = this.handleTouchStart;
  }

  public getSignatureImage(id: number) {
    const headers = new HttpHeaders().set('Accept', 'image/png');
    this.http.get(`http://localhost:8080/signature/${id}`, { headers, responseType: 'blob' })
      .subscribe(response => {
        this.displaySignatureImage(response);
      }, error => {
        console.error('Failed to fetch the signature image:', error);
      });
  }
  public displaySignatureImage(imageBlob: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataURL = reader.result as string;
      this.signatureImage = imageDataURL;
    };
    reader.readAsDataURL(imageBlob);

  }
  
  handleTouchStart(event: TouchEvent) {
    // Votre code de gestion des événements ici
  }




  public save() {
    const dataURL = this.signaturePadInstance.toDataURL();
    console.log(dataURL);

  }

  public clear() {
    this.signaturePadInstance.clear();
  }

  submit() {
    const signature = this.signaturePad.toDataURL();
  }
  Valider(){
    const dataURL = this.signaturePadInstance.toDataURL();
    const signatureData = { signature: dataURL };
    this.http.post('http://localhost:8080/FastBox/add', { signature: dataURL })
    .subscribe(response => {
     alert('Signature saved successfully!');

    }, error => {
      alert('Erreur');
      // Gérez les erreurs si nécessaire
    });
  }


  submitImg(){}
  onSubmit(){}
  Upload(){}
  }