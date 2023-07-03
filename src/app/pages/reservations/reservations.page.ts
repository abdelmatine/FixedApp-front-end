import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, IonModal, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Swiper } from 'swiper';
import { ReservationService } from './services/reservation.service';
import { ConfirmationPage } from './components/confirmation/confirmation.page';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ModalmapPage } from './components/modalmap/modalmap.page';
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
  standalone: true,
  providers: [ReservationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})



export class ReservationsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  latitude: any ;  
  longitude: any ;  
  adresse: any;
  savedInstance!: number;


  myForm: FormGroup;
  testval: string = "test";
  selectedDate: any;



  constructor(   
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController, 
    private route: ActivatedRoute,
    private resService: ReservationService,
    private formBuilder: FormBuilder, ) 
    { 
    this.myForm = this.formBuilder.group({

      
      contractNum: [''],
      boxType: ['INDOOR', Validators.required],
      abbType: ['B2C', Validators.required],
      civilite: ['Monsieur', Validators.required],
      nationalite: ['TN', Validators.required],
      prenom: ['Abdelmatine', Validators.required],
      nom: ['Sfar', Validators.required],
      idType: ['CIN', Validators.required],
      numID: ['09627401', Validators.required],
      naissance: ['', Validators.required],
      adresse: ['exemple 154', Validators.required],
      gouvernorat: ['Ben Arous', Validators.required],
      delegation: ['Boumhal', Validators.required],
      localite: ['Boumhal', Validators.required],
      ville: ['Boumhal', Validators.required],
      codePostal: ['2097', Validators.required],
      email: ['abdelmatinesfar@gmail.com', Validators.required],
      telOne: ['56757140', Validators.required],
      telTwo: [''],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      signatureImage: ['']

    });
  }

  ngOnInit() {
    Geolocation.requestPermissions();

    this.route.paramMap.subscribe(params => {
      const state = window.history.state;
      this.myForm.controls['latitude'].setValue(state.lat);
      this.myForm.controls['longitude'].setValue(state.lng);
    });

  }

  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
 
  goNext() {
    this.swiper?.slideNext();
  }
 
  goPrev() {
    this.swiper?.slidePrev();
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmationPage,
      componentProps: {
        resID: Number(this.savedInstance)
      }
    });

    modal.onDidDismiss().then(() => {
      this.myForm.reset();
    });

  
    await modal.present();
  }

  async openMap() {
    const modal = await this.modalCtrl.create({
      component: ModalmapPage,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    modal.onDidDismiss().then((data) => {
    });


        console.log(data);
        console.log(data.data.lat);
        console.log(data.data.long);

        const latitude = data.data.lat;
        const longitude = data.data.long;

        this.myForm.controls['latitude'].setValue(data.data.lat);
        this.myForm.controls['longitude'].setValue(data.data.long);

        const options = {
          latitude, // Example latitude
          longitude, // Example longitude
        };
        
        const address = await NativeGeocoder.reverseGeocode(options);
        console.log('l"adresse:'+address)
        const ville = address.addresses[0].locality;
        const codePostal = address.addresses[0].postalCode;
        //const gouvernorat = 
        this.myForm.controls['ville'].setValue(ville);
        this.myForm.controls['codePostal'].setValue(codePostal);
        this.myForm.controls['gouvernorat'].setValue(address.addresses[0].administrativeArea);
        this.myForm.controls['localite'].setValue(address.addresses[0].locality);
        this.myForm.controls['delegation'].setValue(address.addresses[0].administrativeArea);
        console.log(ville)


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


  handleClick(){
    this.onSubmit();
    this.cancel();
  }


  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caractères restants`;
  }

  onInput(event: any) {
    const inputValue: string = event.target.value;
    if (inputValue.length >= 8) {
      event.target.value = inputValue.slice(0, 8);
      event.target.blur();
    }
  }





  async onSubmit() {
    const formData = this.myForm.value;
    let loading;
  
    try {
      loading = await this.showLoading();
      
      const response = await this.resService.getLastContractNumFromDatabase().toPromise();
  
      if (response) {
        console.log('numero de contract response:', response.contractNum);
        this.resService.lastContractNum = response.contractNum;
        console.log('lastContractNum val:', response.contractNum);
      } else {
        this.resService.lastContractNum = '23-00000000';
      }
      formData.contractNum = this.resService.generateContractNum();
      const result = await this.resService.addReservation(formData).toPromise();
  
      this.savedInstance = Number(result);
      console.log(this.savedInstance);
      console.log('Form submitted successfully');
      this.openModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      if (loading) {
        await this.hideLoading(loading);
      }
    }
  }

  getCurrentLocation = async () => {  
    const coordinates = await Geolocation.getCurrentPosition();
  
    this.myForm.controls['latitude'].setValue(coordinates.coords.latitude);
    this.myForm.controls['longitude'].setValue(coordinates.coords.longitude);

  }


  private async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Submitting form...',
      spinner: 'crescent',
      translucent: true,
      backdropDismiss: false
    });
    await loading.present();
    return loading;
  }
  
  private async hideLoading(loading: HTMLIonLoadingElement) {
    await loading.dismiss();
  }


}



/*
  onSubmit() {
    const formData = this.myForm.value;
  
    this.resService.getLastContractNumFromDatabase().pipe(
      switchMap((response: any) => {
        if (response) {
          console.log('numero de contract response:', response.contractNum);
          this.resService.lastContractNum = response.contractNum;
          console.log('lastContractNum val:', response.contractNum);
        } else {
          this.resService.lastContractNum = '23-00000000';
        }
        formData.contractNum = this.resService.generateContractNum();
        return this.resService.addReservation(formData);
      })
    ).subscribe(
      (response: any) => {
        this.savedInstance = Number(response);
        console.log(this.savedInstance);
        console.log('Form submitted successfully');
        this.openModal();
      },
      (error) => {
        console.error('Error submitting form:', error);
      }
    );
  }
*/