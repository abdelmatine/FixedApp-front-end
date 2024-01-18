import { Component, OnInit,ViewChild,ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IonicSlides } from '@ionic/angular';
import { Swiper } from 'swiper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import SignaturePad from 'signature_pad';
import { FixService } from './service/fix.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-fixe-jdid',
  templateUrl: './fixe-jdid.page.html',
  styleUrls: ['./fixe-jdid.page.scss'],
  standalone: true,
  providers: [FixService],
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class FixeJdidPage implements OnInit {
  id : number = 0;
  fixId : number = 0;
  searchResults: any | null = null;
  selectedMsisdn: string | undefined;
  availableMsisdns: string[] = [];
  ImageSourceContrat: string = '';
  signatureImage!: string;
  typeDeBoxValue!: string;
  msisdnValue!: string;
  abonnementValue!: string;
  private signaturePadInstance: any;
  @ViewChild('signaturePad') signaturePad: any;
  private signaturePadOptions: Object = { // options de signature_pad
    backgroundColor: '#ffffff',
    penColor: '#000000',
    minWidth: 2,
    maxWidth: 4,
  };
  private canvas: any;


  error: string| undefined;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  fixe: FormGroup = this.formBuilder.group({
    contractNum: [''],
    debit: ['12GO', Validators.required],
    type: ['outdoor', Validators.required],
    abonnement: ['mensuelle', Validators.required],
    imei: ['0008759856756', Validators.required],
    kitcode: ['541200064854', Validators.required],
    recherche: [''],
    formulaire: [''],
    msisdn: ['36555140',Validators.required],
    conditions: [''],
    preuves: [''],
    contrats: ['']

  });



  constructor(   
    private fixService: FixService, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,private http: HttpClient,  private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,private router: Router) { }

  ngOnInit() {
    this.fetchAvailableMsisdns();
    this.route.queryParams.subscribe(params => {
      this.id = params['actId'];
      console.log(this.id);
    });
  }
  areFieldsValid(): boolean {
    const imageFields = [
      'formulaire',
      'conditions',
      'preuves',
      'contrats'
    ];

    for (const field of imageFields) {
      if (this.fixe.get(field)?.value) {
        return false; // Si au moins un champ d'image est non vide, retourne false
      }
    }

    return true; // Tous les champs d'image sont vides, retourne true
  }
  submit() {
console.log("hi");
  }


  searchMsisdn(event: any) {
    const msisdnControl = this.fixe.get('msisdn');

    const msisdn = event.target.value || '';
    const url = `${environment.baseApiUrl}/api/FixeJdid/search?msisdn=${msisdn}`;

    this.http.get(url).subscribe((result: any) => {
      this.searchResults = result || [];
      this.selectedMsisdn = '';
      this.error = '';

      // Créer un tableau pour stocker les MSISDN déjà affichés
      const displayedMsisdns: string[] = [];

      // Filtrer les résultats pour n'afficher qu'une seule fois chaque MSISDN
      this.searchResults = this.searchResults.filter((item: any) => {
        if (!displayedMsisdns.includes(item.msisdn)) {
          displayedMsisdns.push(item.msisdn);
          return true;
        }
        return false;
      });

      if (this.searchResults.length === 0) {
        this.error = 'Le MSISDN n\'existe pas.';
      }
    });
  }


  selectMsisdn(msisdn: string) {
    this.checkMsisdnAvailability(msisdn)
      .then((msisdnDisponible: boolean) => {
        if (msisdnDisponible) {
          this.fixe.patchValue({ msisdn: msisdn });
          this.error = '';
        } else {
          this.selectedMsisdn = '';
          this.error = 'Le MSISDN n\'est pas disponible.';
          this.fetchAvailableMsisdns();
        }
      })
      .catch((error: any) => {
        console.error('Error checking MSISDN availability:', error);
        this.selectedMsisdn = '';
        this.error = 'Une erreur s\'est produite lors de la vérification de la disponibilité du MSISDN.';
      });
  }

  fetchAvailableMsisdns() {
    const url = 'http://localhost:8080/FixedApp/api/FixeJdid/getAvailableMsisdns'; // Replace with the appropriate API endpoint

    this.http.get(url)
      .toPromise()
      .then((result: any) => {
        // Update the list of available MSISDNs
        this.availableMsisdns = result;
      })
      .catch((error: any) => {
        console.error('Error fetching available MSISDNs:', error);
      });
  }

  checkMsisdnAvailability(msisdn: string): Promise<boolean> {
    const url = `http://localhost:8080/FixedApp/api/FixeJdid/search?msisdn=${msisdn}`;

    return this.http.get(url)
      .toPromise()
      .then((result: any) => {
        // Check if the result contains any MSISDNs
        if (result && result.length > 0) {
          // MSISDN is available
          return true;
        } else {
          // MSISDN is not available
          return false;
        }
      })
      .catch((error: any) => {
        console.error('Error checking MSISDN availability:', error);
        throw new Error('Une erreur s\'est produite lors de la vérification de la disponibilité du MSISDN.');
      });
  }
//upload ImageFormulaire
isFirstSlideValid = false;
isFormValid: boolean = false;
isFormFilled: boolean = false;
public formulaireCapturee: boolean = false;
public conditionsCapturee: boolean = false;
public preuveCapturee: boolean = false;
public contratCapturee: boolean = false;

currentSlideIndex = 0;

imageSources: { [key: string]: string } = {};
formulaireImageSource: string | null = null;
conditionsImageSource: string | null = null;
preuveImageSource: string | null = null;
contratImageSource:string | null = null;

private captureImages = async () => {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
  });

};



async conditions() {
  try {
    const image = await this.captureImages();
    const captureDateTime = new Date().toLocaleString();
    const validImages = image.dataUrl;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);

        const dateTimeText = captureDateTime;
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(dateTimeText, 10, 30);

        const reductionFactor = 0.5;
        const desiredWidth = canvas.width * reductionFactor;
        const desiredHeight = canvas.height * reductionFactor;

        const resizedCanvas = document.createElement('canvas');
        const resizedContext = resizedCanvas.getContext('2d');

        if (resizedContext) {
          resizedCanvas.width = desiredWidth;
          resizedCanvas.height = desiredHeight;

          resizedContext.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            desiredWidth,
            desiredHeight
          );

          const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

          // Enregistrez l'image capturée dans la variable conditionsImageSource
          this.conditionsImageSource = resizedImageDataWithDateTime;
        } else {
          console.error('Impossible d\'obtenir le contexte du canvas réduit.');
        }
      }
    };

    if (validImages) {
      img.src = validImages;
    } else {
      console.error('Données base64 invalides pour l\'image capturée.');
    }
  } catch (error) {
    console.error('Erreur lors de la capture d\'images :', error);
  }
}



  async formualire() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);

          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;

          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');

          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

            resizedContext.drawImage(
              canvas,
              0,
              0,
              canvas.width,
              canvas.height,
              0,
              0,
              desiredWidth,
              desiredHeight
            );

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.formulaireImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }
  async preuve() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);

          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;

          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');

          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

            resizedContext.drawImage(
              canvas,
              0,
              0,
              canvas.width,
              canvas.height,
              0,
              0,
              desiredWidth,
              desiredHeight
            );

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.preuveImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }


async contrat() {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90,
    });

    const captureDateTime = new Date().toLocaleString();
    const validImages = image.base64String;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);

        const dateTimeText = captureDateTime;
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(dateTimeText, 10, 30);

        const reductionFactor = 0.5;
        const desiredWidth = canvas.width * reductionFactor;
        const desiredHeight = canvas.height * reductionFactor;

        const resizedCanvas = document.createElement('canvas');
        const resizedContext = resizedCanvas.getContext('2d');

        if (resizedContext) {
          resizedCanvas.width = desiredWidth;
          resizedCanvas.height = desiredHeight;

          resizedContext.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            desiredWidth,
            desiredHeight
          );

          const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

          // Enregistrez l'image capturée dans la variable preuveImageSource
          this.contratImageSource = resizedImageDataWithDateTime;
        } else {
          console.error('Impossible d\'obtenir le contexte du canvas réduit.');
        }
      }
    };

    img.src = 'data:image/jpeg;base64,' + validImages;
  } catch (error) {
    console.error('Erreur lors de la capture d\'images :', error);
  }
}
async captureImage(type: string) {
  try {
    const image = await this.captureImages();
    const captureDateTime = new Date().toLocaleString();
    const validImages = image.dataUrl;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);

        const dateTimeText = captureDateTime;
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(dateTimeText, 10, 30);

        const reductionFactor = 0.5;
        const desiredWidth = canvas.width * reductionFactor;
        const desiredHeight = canvas.height * reductionFactor;

        const resizedCanvas = document.createElement('canvas');
        const resizedContext = resizedCanvas.getContext('2d');

        if (resizedContext) {
          resizedCanvas.width = desiredWidth;
          resizedCanvas.height = desiredHeight;

          resizedContext.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            desiredWidth,
            desiredHeight
          );

          const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

          // Enregistrez l'image capturée dans la variable correspondante en fonction du type
          if (type === 'formulaire') {
            this.formulaireImageSource = resizedImageDataWithDateTime;
          } else if (type === 'conditions') {
            this.conditionsImageSource = resizedImageDataWithDateTime;
          } else if (type === 'preuve') {
            this.preuveImageSource = resizedImageDataWithDateTime;
          } else if (type === 'contrat') {
            this.contratImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Type d\'image invalide :', type);
          }
        } else {
          console.error('Impossible d\'obtenir le contexte du canvas réduit.');
        }
      }
    };

    if (validImages) {
      img.src = validImages;
      return img; // Return the captured image data
    } else {
      console.error('Données base64 invalides pour l\'image capturée.');
      return null; // Return null if image capture failed
    }
  } catch (error) {
    console.error('Erreur lors de la capture d\'images :', error);
    return null; // Return null if an error occurred during image capture
  }
}



exitCapture(type: string) {
  // Réinitialisez la variable correspondante à `null` pour effacer l'image affichée
  if (type === 'formulaire') {
    this.formulaireImageSource = null;
  } else if (type === 'conditions') {
    this.conditionsImageSource = null;
  } else if (type === 'preuve') {
    this.preuveImageSource = null;
  }else if (type ==='contrat'){
    this.contratImageSource = null;
  }
}


async captureFormulaire() {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90
    });

    if (image?.base64String) {
      const validImage = image.base64String;
      console.log(validImage);
      this.fixe.value.formulaire = validImage;
      console.log(this.fixe.value.formulaire);
      this.formulaireCapturee = true; // Mettre à jour la variable après la capture réussie de l'image
    } else {
      console.log('No image captured');
    }
  } catch (error) {
    console.error('Error capturing image:', error);
  }
}



// Déclarez la variable isSubmitting
isSubmitting = false;

async submitForm() {
  const loading = await this.loadingCtrl.create({
    message: 'Veuillez patienter...',
  });

  try {
    await loading.present();

    const response = await this.fixService.getLastContractNumFromDatabase().toPromise();

    if (response) {
      console.log('Numero de contract response:', response.contractNum);
      this.fixService.lastContractNum = response.contractNum;
      console.log('LastContractNum val:', response.contractNum);
    } else {
      this.fixService.lastContractNum = '24-00000000';
    }

    console.log('submitForm called');

    // Enregistrer les valeurs des attributs dans des variables locales
    const typeDeBoxValue = this.fixe.get('type')?.value;
    const msisdnValue = this.fixe.get('msisdn')?.value;
    const abonnementValue = this.fixe.get('abonnement')?.value;
    const formulaireImage = this.fixe.get('formulaire')?.value;
    const conditionsImage = this.fixe.get('conditions')?.value;
    const preuvesImage = this.fixe.get('preuves')?.value;
    const contratsImage = this.fixe.get('contrats')?.value;

    const formulaireBlob = btoa(formulaireImage);
    const conditionsBlob = btoa(conditionsImage);
    const preuvesBlob = btoa(preuvesImage);
    const contratsBlob = btoa(contratsImage);

    const actId = this.id;
    const formData = this.fixe.value;
    formData.contractNum = this.fixService.generateContractNum();

    console.log(formData);

    const postResponse = await this.http.post(`${environment.baseApiUrl}/api/FixeJdid/addfixe/${actId}`, formData).toPromise();

    this.fixId = Number(postResponse);
    console.log(this.fixId);

    this.presentAlert('Succès', 'Votre demande a été envoyée avec succès.');
    console.log('Form submitted successfully');
    this.goNext();

    // Réaffecter les valeurs des attributs après la soumission du formulaire
    this.typeDeBoxValue = typeDeBoxValue;
    this.msisdnValue = msisdnValue;
    this.abonnementValue = abonnementValue;

    // Réinitialiser le formulaire
    this.fixe.reset();

  } catch (error) {
    console.error('Error submitting form:', error);
    this.presentAlert('Erreur', 'Échec de l\'enregistrement des données dans la base de données. Veuillez réessayer plus tard.');
  } finally {
    loading.dismiss();
  }
}





imageSource: string = '';


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
selectedTypeDeBox: string | undefined;
selectedAbonnement:string|undefined;
updateTypeDeBox() {
  const typeDeBoxControl = this.fixe.get('type');

  if (typeDeBoxControl && typeDeBoxControl.value !== null) {
    this.selectedTypeDeBox = typeDeBoxControl.value as string;
    typeDeBoxControl.patchValue(this.selectedTypeDeBox);
  } else {
    this.selectedTypeDeBox = undefined;
  }
}
updateAbonnement() {
  const abonnementControl = this.fixe.get('abonnement');

  if (abonnementControl && abonnementControl.value !== null) {
    this.selectedAbonnement = abonnementControl.value as string;
    abonnementControl.patchValue(this.selectedAbonnement);
  } else {
    this.selectedAbonnement = undefined;
  }

}





displayAttributeValues() {


}
goNext() {
  this.swiper?.slideNext();
  this.displayAttributeValues();
}
swiperSlideChanged(e: any) {
  console.log('changed: ', e);
}

swiperReady() {
  this.swiper = this.swiperRef?.nativeElement.swiper;
}
goPrev() {
  this.swiper?.slidePrev();
  this.displayAttributeValues();

}

public displaySignatureImage(imageBlob: Blob) {
  const reader = new FileReader();
  reader.onloadend = () => {
    const imageDataURL = reader.result as string;
    this.signatureImage = imageDataURL;
  };
  reader.readAsDataURL(imageBlob);

}
ngAfterViewInit() {
this.canvas = this.signaturePad.nativeElement;
this.signaturePadInstance = new SignaturePad(this.canvas, this.signaturePadOptions);
}
public clear() {
this.signaturePadInstance.clear();
}
reglement() {
  this.displayAttributeValues();
  if (this.signaturePadInstance.isEmpty()) {
    alert('Veuillez signer avant de continuer.');
  } else {
    const dataURL = this.signaturePadInstance.toDataURL();
    const signatureData = { signature: dataURL };
    this.http.put(`${environment.baseApiUrl}/api/FixeJdid/add/${this.fixId}`, { signature: dataURL })
    .subscribe(response => {
      console.log('Signature saved successfully!');
    
    }, error => {
      console.error('Failed to save the signature:', error);
    });
    const navigationExtras: NavigationExtras = {
      queryParams: {
        actId: this.id,
        source: 'fixe-jdid'
      }
    };
    this.router.navigate(['/reglement'], {
      queryParams: { source: 'fixe-jdid', actId:this.id }
    });
}
}


Submit(){
const dataURL = this.signaturePadInstance.toDataURL();
const signatureData = { signature: dataURL };
this.http.post(`${environment.baseApiUrl}/api/FixeJdid/add/${this .fixId}`, { signature: dataURL })
.subscribe(response => {
  console.log('Signature saved successfully!');

}, error => {
  console.error('Failed to save the signature:', error);
});

}
}