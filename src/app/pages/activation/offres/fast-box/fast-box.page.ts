import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import SignaturePad from 'signature_pad';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { forkJoin } from 'rxjs';
import { Swiper } from 'swiper';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-fast-box',
  templateUrl: './fast-box.page.html',
  styleUrls: ['./fast-box.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class FastBoxPage implements OnInit {

  fastBox: FormGroup = this.formBuilder.group({
    clientPossedeNumero: [''],
    numeroTT: ['']
  });
  @ViewChild('swiper', { read: ElementRef }) swiperElement!: ElementRef;
  @ViewChild('imageElement', { read: ElementRef }) imageElement!: ElementRef;
  @ViewChild('swiper')



  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  submissionType: any ;
  signatureImage!: string;
  source : string | undefined;
  productType!:string;
  files!: File[];
  ImageSourceContrat: string = '';

  @ViewChild('signaturePad') signaturePad: any;

  goNext() {
    this.swiper?.slideNext();
  }
  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  goPrev() {
    this.swiper?.slidePrev();
  }
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
  selectedAbonnementType: string | undefined;

  subscriptions = [
    'Fast Box 1P/2P : annuelle/semestrielle',
    'Fast Box Jdid / Fast+ Box : mensuelle'
  ];

  debits = [
    '8G',
    '12G'
  ];
  afficherBoutonVerifier: boolean = false;

onClientPossedeNumeroChange() {
  const clientPossedeNumeroValue = this.prospector.controls['clientPossedeNumero'].value;
  this.afficherBoutonVerifier = (clientPossedeNumeroValue === 'OUI');
}

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,

  ) {
    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
    });

    this.prospector = this.formBuilder.group({
      msisdn: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^[0-9]+$')
      ]],
       debit: ['', Validators.required],
      abonnement: ['', Validators.required],
      categorie: ['', Validators.required],
      numeroserie:['', Validators.required],
      prix: ['', Validators.required],
      clientPossedeNumero:[''],
      signature_image:[''],
      numeroTT: [''],
      contratImage:[''],
      preuveImage:['']

    });
  }
  onInput(event: any) {
    const inputValue: string = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Supprime tous les caractères non numériques

    if (numericValue.length >= 8) {
      event.target.value = numericValue.slice(0, 8); // Tronque l'entrée à la longueur maximale de 8
      event.target.blur(); // Supprime le focus de l'entrée
    } else {
      event.target.value = numericValue; // Met à jour la valeur avec les chiffres uniquement
    }
  }
   ngOnInit() {
    console.log(this.source);

  }

  Verifier() {
    this.swiper?.slideNext();

    const numeroTT = this.fastBox.controls['numeroTT'].value;
    if (numeroTT) {
      this.http.get<boolean>(`http://localhost:8080/FastBox/verify/${numeroTT}`).subscribe(
        (response) => {
          if (response) {
            alert('Le client possède une ligne.');
          } else {
            alert('Le client ne possède pas de ligne.');
          }
        },
        (error) => {
          alert('Une erreur s\'est produite lors de la vérification de la ligne.');
        }
      );
    } else {
      alert('Veuillez fournir un numéro de TT.');
    }
  }


  selectedAbonnement() {
    if (this.fastBox.controls['abonnement'].value === 'Fast Box 1P/2P : annuelle/semestrielle') {
      this.selectedAbonnementType = 'annuelle/semestrielle';
    } else if (this.fastBox.controls['abonnement'].value === 'Fast Box Jdid / Fast+ Box : mensuelle') {
      this.selectedAbonnementType = 'mensuelle';
    } else {
      this.selectedAbonnementType = undefined;
    }
    }

  onSelectionChange(){}
  Suivant(){
    this.swiper?.slideNext();

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
  handleTouchStart(event: TouchEvent) {
    // Votre code de gestion des événements ici
  }


  public clear() {
    this.signaturePadInstance.clear();
  }

  public save() {
    const dataURL = this.signaturePadInstance.toDataURL();
    console.log(dataURL);

  }

  submit() {
    const signature = this.signaturePad.toDataURL();
  }
  displayAttributeValues() {
    console.log('Displaying attribute values...');
  }
  async Valider() {
    if (this.signaturePadInstance.isEmpty()) {
      alert('Veuillez signer avant de continuer.');
    } else {
      const dataURL = this.signaturePadInstance.toDataURL();
      const signatureData = { signature: dataURL };

      // Afficher une boîte de dialogue de confirmation
      const confirmAlert = await this.alertCtrl.create({
        header: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir signer ?',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Confirmer',
            handler: () => {
              this.http.post('http://localhost:8080/FastBox/add', { signature: dataURL })
              .subscribe(
                  response => {
                    console.log('Signature saved successfully!');
                    this.displayAttributeValues(); // Call the method to display attribute values
                    this.router.navigate(['/home']);
                  },
                  error => {
                    console.error('Failed to save the signature:', error);
                  }
                );
            }
          }
        ]
      });

      // Afficher la boîte de dialogue de confirmation
      await confirmAlert.present();
    }
  }

   onSubmit(){

  }




   onFileChange(event: any) {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    // Handle the selected file here
  }

   Upload() {
    this.onSubmit();
    const emailEndpoint = 'http://localhost:8080/email/send';
    const smsEndpoint = 'http://localhost:8080/ooredoo/SMS';

    const emailData = new FormData();
    emailData.append('to', 'amina.tarkhanitarkhani@gmail.com');
    emailData.append('cc', 'amina.tarkhanitarkhani@gmail.com');
    emailData.append('subject', 'ACTIVATION FORFAIT');
    emailData.append('body', 'Félicitation votre forfait a été activé avec succès');

    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (file) {
      emailData.append('file', file);
    }

    const smsData = {
      smsMessages: 'Congratulations! Your account has been activated successfully.',
      destinationSMSNumber: '+21624437860'
    };

    const emailRequest = this.http.post(emailEndpoint, emailData);
    const smsRequest = this.http.post(smsEndpoint, smsData);


    forkJoin([emailRequest, smsRequest]).subscribe(
      (responses) => {
        console.log('Requests completed successfully!');
        // Handle responses as needed
      },
      (error) => {
        console.error('Failed to send requests:', error);
      }
    );
  }
  navigateToRaccordementPage(){
     this.router.navigateByUrl('/raccordement');

}
contratImage = async () => {
  const image = await this.captureImage();
  if (image?.dataUrl) {
    const imageData = image.dataUrl.split(',')[1];
    this.ImageSourceContrat = imageData;
  } else {
    console.log('No image data available');
  }
};

private captureImage = async () => {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
  });
};
async captureImages() {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90
    });

    if (image.base64String) {
      const validImages = image.base64String;
      console.log(validImages);
      this.fastBox.value.mondat = validImages;
      console.log(this.fastBox.value.mondat);
      this.imageElement.nativeElement.src = 'data:image/jpeg;base64,' + validImages;
    } else {
      console.log('User cancelled image selection');
    }
  } catch (error) {
    console.error('Error capturing images:', error);
    // Handle error cases
  }
}


preuveImage(){}

async submitForm() {
  const loading = await this.loadingCtrl.create({
    message: 'Veuillez patienter...',
  });
  await loading.present();
  const formData = this.fastBox.value;
  console.log(formData);
  this.http.post('http://localhost:8080/FastBox/ajouter', formData)
  .subscribe((response) => {
    loading.dismiss();
    this.fastBox.reset();
    this.presentAlert('Succès', 'Votre demande  a été envoyée avec succès.');
    console.log('Form submitted successfully');
  }, (error) => {
    loading.dismiss();
    this.presentAlert('Erreur', 'Échec de l"enregistrement des données dans la base de données. Veuillez réessayer plus tard.');
    console.error('Error submitting form:', error);
  });

}


async presentAlert(header: string, message: string) {
  const alert = await this.alertCtrl.create({
    header,
    message,
    buttons: []
  });
  await alert.present();

  setTimeout(() => {
    alert.dismiss();
  }, 1000);
}


demandePic(){}
}