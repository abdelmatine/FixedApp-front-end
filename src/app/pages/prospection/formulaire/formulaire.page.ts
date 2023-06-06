import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, IonModal, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClientModule} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Swiper } from 'swiper';
import { ProspectionService } from '../services/prospection.service';



@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.page.html',
  styleUrls: ['./formulaire.page.scss'],
  providers: [ProspectionService],
  standalone: true,
  imports: [IonicModule, 
            CommonModule, 
            FormsModule,
            HttpClientModule,
            ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormulairePage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  @ViewChild(IonModal) modal: IonModal | undefined;




  latitude: any ;  
  longitude: any ;  
  adresse: any;

  prospector: FormGroup ;

  showBackdrop = true;


  constructor(
    private prospectionService: ProspectionService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,)
    
    {
      this.prospector = this.formBuilder.group({
        offreType: ['Fibre Optique'],
        fullName: ['', Validators.required],
        numID: ['', Validators.required],
        contactNum: ['', Validators.required],
        latitude: [this.latitude, Validators.required],
        longitude: [this.longitude, Validators.required],
        adresse: [this.adresse, Validators.required],
        zone: ['', Validators.required],
        access: [''],
        residenceName: [''],
        bloc: [''],
        etage: [''],
        appartement: [''],
        raison: [''],
        autres: [''],
        etat: ['', Validators.required],


      }, { validator: this.validateCouverture });

    }




    ngOnInit() {
      Geolocation.requestPermissions();

      this.latitude = this.route.snapshot.queryParamMap.get('latitude');
      this.longitude = this.route.snapshot.queryParamMap.get('longitude');
      this.adresse = this.route.snapshot.queryParamMap.get('adresse');

      console.log(this.latitude, this.longitude, this.adresse);
    }


    swiperSlideChanged(e: any) {
      console.log('changed: ', e);
    }
   
    swiperReady() {
      this.swiper = this.swiperRef?.nativeElement.swiper;
    }
   
    goNext() {
      this.swiper?.slideNext();
    }
   
    goPrev() {
      this.swiper?.slidePrev();
    }

    goToProspection(){
      this.router.navigate(['/prospection']);
    }
  
  
    gotoHome() {
      this.prospector.reset();
      this.router.navigate(['/home']);
    }


    goToMaps() {
      this.router.navigate(['/map']);
      }



    validateCouverture(group: FormGroup) {
      const offreControl = group.controls['offreType'];
      offreControl.disabled;

      if(group.controls['zone'].value === 'Zone Couverte'){
        const accessControl = group.controls['access'];
        accessControl.setValidators([Validators.required]);

        if (group.controls['access'].value === 'SANS') {
          const raisonControl = group.controls['raison'];
          raisonControl.setValidators([Validators.required]);

          if(group.controls['raison'].value === 'Autres'){
            const autresControl = group.controls['autres'];
            autresControl.setValidators([Validators.required]);
          }
        }
    }
  }




   getCurrentLocation = async () => {  
    const coordinates = await Geolocation.getCurrentPosition();

    this.prospector.controls['latitude'].setValue(coordinates.coords.latitude);
    this.prospector.controls['longitude'].setValue(coordinates.coords.longitude);
  
  }


  customCounterFormatter(inputLength: number, maxLength: number) {

    return `${maxLength - inputLength} caractères restants`;
  }

      onSelectionChange() {
  console.log('Selected value:', this.prospector.controls['raison'].value);    
  }

  onInput(event: any) {
    const inputValue: string = event.target.value;
    if (inputValue.length >= 8) {
      event.target.value = inputValue.slice(0, 8); // Truncate input to maximum length
      event.target.blur(); // Remove focus from the input
    }
  }
  


  async onSubmit(){
    this.ConfirmationFormSubmitAlert('Confirmation', 'Confirmer la submission ?');
  }


  async submitForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Veuillez patienter...',
    });
    await loading.present();
    const formData = this.prospector.value;

    this.prospectionService.addProspection(formData)
      .subscribe(
        (response) => {
          loading.dismiss();
          this.prospector.reset();
          this.presentAlert('Succès', 'Votre demande de prospection a été envoyée avec succès.');
          console.log('Form submitted successfully');
        },
        (error) => {
          loading.dismiss();
          this.presentAlert('Erreur', 'Échec de l"enregistrement des données dans la base de données. Veuillez réessayer plus tard.');
          console.error('Error submitting form:', error);
        }
      );
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

  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }



  

  async ConfirmationFormSubmitAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [      
        {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          this.prospector.reset();
        }
      },
      {
        text: 'modifier',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Confirmer',
        handler: () => {
          this.submitForm();
        }
      }]
    });
    await alert.present();
  }




  async getActualPosAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [      
        {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Confirmer',
        handler: () => {
          this.getCurrentLocation();
        }
      }]
    });
    await alert.present();
  }

}




