import { Component, OnInit,ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule,ValidatorFn,Validators} from '@angular/forms';
import { AlertController, IonModal, IonicModule, LoadingController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA ,ElementRef} from '@angular/core';
import SignaturePad from 'signature_pad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Swiper } from 'swiper';
import { Router } from '@angular/router';




@Component({
  selector: 'app-super-box',
  templateUrl: './super-box.page.html',
  styleUrls: ['./super-box.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,FormsModule,ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SuperBoxPage implements OnInit {
  superbox: FormGroup ;
  @ViewChild(IonModal) modal: IonModal | undefined;

  @ViewChild('signaturePad') signaturePad: any;
  private signaturePadOptions: Object = { // options de signature_pad
    backgroundColor: '#ffffff',
    penColor: '#000000',
    minWidth: 2,
    maxWidth: 4,
  };
  private canvas: any;
  private signaturePadInstance: any;
  signatureImage!: string;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  constructor(private http:HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private router:Router) {
      this.superbox = this.formBuilder.group({
        choix: ['', Validators.required],
        iccid: ['' ,Validators.required],
        numeroserie:['', Validators.required],
        zonerecherche:['', Validators.required],
          msisdn: ['', [
            Validators.required,
            Validators.maxLength(8),
            Validators.pattern('^[0-9]+$')
          ]],
        signature_image: ['']
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

    cancel() {
      this.modal!.dismiss(null, 'cancel');
    }



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

    ngAfterViewInit() {
      this.canvas = this.signaturePad.nativeElement;
      this.signaturePadInstance = new SignaturePad(this.canvas, this.signaturePadOptions);
    }

    public clear() {
      this.signaturePadInstance.clear();
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
                this.http.post('http://localhost:8080/SuperBox/add', { signature: dataURL })
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



    submit() {

  const formData = this.superbox.value;

    this.http.post('http://localhost:8080/SuperBox/ajouter', formData)
    .subscribe(response => {
      // Traitement de la réponse du backend
      console.log('Données enregistrées avec succès !');
      // Ajoutez ici votre logique supplémentaire après l'enregistrement des données
    }, error => {
      console.error('Une erreur s\'est produite lors de l\'enregistrement des données :', error);
      // Gérez l'erreur selon vos besoins
    });

  }



  ngOnInit() {
  }



  ActiverBox() {

}
}