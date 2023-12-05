import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, IonModal, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Swiper } from 'swiper';
import { ProspectionService } from '../services/prospection.service';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { ModalmapPage } from '../../reservations/components/modalmap/modalmap.page';
import { StorageService } from '../../login/services/storage.service';


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
    private storageService: StorageService,
    private modalCtrl: ModalController, 
    private prospectionService: ProspectionService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,)
    
    {
      this.prospector = this.formBuilder.group({
        offreType: ['Fibre Optique'],
        fullName: ['Abdelmatine Sfar', Validators.required],
        numID: ['09627401', Validators.required],
        contactNum: ['56757140', Validators.required],
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

      this.route.paramMap.subscribe(params => {
        const state = window.history.state;
        this.latitude = state.lat;
        this.longitude = state.lng;
        this.prospector.controls['latitude'].setValue(state.lat);
        this.prospector.controls['longitude'].setValue(state.lng);
      
      });
      console.log(this.latitude, this.longitude);



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
        }
    }
  }




   getCurrentLocation = async () => {  
    const coordinates = await Geolocation.getCurrentPosition();

    const latitude = coordinates.coords.latitude;
    const longitude = coordinates.coords.longitude;

    this.prospector.controls['latitude'].setValue(coordinates.coords.latitude);
    this.prospector.controls['longitude'].setValue(coordinates.coords.longitude);
    
    const options = {
      latitude: latitude, // Example latitude
      longitude: longitude // Example longitude
    };
    console.log(options);
    //const adress = await NativeGeocoder.reverseGeocode(options);
    //console.log(adress)
    const adress = await NativeGeocoder.reverseGeocode(options);
    console.log(adress)
  }


  async openMap() {
    const modal = await this.modalCtrl.create({
      component: ModalmapPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    modal.onDidDismiss().then((data) => {
    });


        console.log(data);
        console.log(data.data.lat);
        console.log(data.data.long);

        const latitude = data.data.lat;
        const longitude = data.data.long;

        const options = {
          latitude, 
          longitude 
        };

        console.log('options: '+options);



        const address = await NativeGeocoder.reverseGeocode(options);
        console.log(address);
        const locality = address.addresses[0].locality;
        console.log(locality);

        this.prospector.controls['latitude'].setValue(data.data.lat);
        this.prospector.controls['longitude'].setValue(data.data.long);
  

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
    const userId = this.storageService.getUserId();

    
    this.prospectionService.addProspection(userId,formData)
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
      buttons: [      
        {
        text: 'Confirmer',
        handler: () => {
          this.gotoHome();
        }
      }]
    });
    await alert.present();

    // setTimeout(() => {
    //   alert.dismiss();
    // }, 1000);
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




