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
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ModalmapPage } from './components/modalmap/modalmap.page';
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { LoadingController } from '@ionic/angular';
import { StorageService } from '../login/services/storage.service';
import { ReglementPage } from './components/reglement/reglement.page';

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

  selectedIdType: string | undefined;

  myForm: FormGroup;
  testval: string = "test";
  selectedDate: any;



  constructor( 
    private storageService: StorageService,  
    private router: Router,
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
      prenom: ['Test', Validators.required],
      nom: ['test', Validators.required],
      idType: ['CIN', Validators.required],
      numID: ['09627401', Validators.required],
      naissance: ['', Validators.required],
      adresse: ['', Validators.required],
      gouvernorat: ['', Validators.required],
      delegation: ['', Validators.required],
      localite: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
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

  onIdTypeChange(event: any) {
    this.selectedIdType = event.detail.value;

    switch (this.selectedIdType) {
      case 'PASS':
        this.myForm.get('numID')!.setValidators([Validators.minLength(10), Validators.maxLength(10)]);
        this.myForm.get('numID')!.updateValueAndValidity();
        break;
      case 'CIN':
        this.myForm.get('numID')!.setValidators([Validators.minLength(8), Validators.maxLength(8)]);
        this.myForm.get('numID')!.updateValueAndValidity();
        break;
      // Add more cases for other ID types if needed
    }
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


  gotoHome() {
    this.router.navigate(['/home']);
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmationPage,
      componentProps: {
        resID: Number(this.savedInstance)
      }
    });

    modal.onDidDismiss().then(() => {
      this.gotoHome();

    });

  
    await modal.present();
  }


  async openModalReg() {
    const modal = await this.modalCtrl.create({
      component: ReglementPage,
      componentProps: {
        resID: Number(this.savedInstance)
      }
    });

    modal.onDidDismiss().then(() => {
     // this.gotoHome();
     console.log("dissmised");

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

        //const gouvernorat = 
        this.myForm.controls['ville'].setValue(address.addresses[0].subLocality);
        this.myForm.controls['codePostal'].setValue(address.addresses[0].postalCode);
        this.myForm.controls['gouvernorat'].setValue(address.addresses[0].administrativeArea);
        this.myForm.controls['localite'].setValue(address.addresses[0].locality);
        this.myForm.controls['delegation'].setValue(address.addresses[0].subAdministrativeArea);
        this.myForm.controls['adresse'].setValue(address.addresses[0].subThoroughfare+' '+address.addresses[0].thoroughfare);

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


  customCounterFormatter(inputLength: number, maxLength: number): string {
    return `${maxLength - inputLength} caractères restants`;
  }

  getInputType(): string {
    return this.selectedIdType === 'CIN' ? 'number' : 'text';
  }

  onInput(event: any) {
    const x = this.selectedIdType === 'CIN' ? 8 : 10;
    const inputValue: string = event.target.value;

    if (inputValue.length >= x) {
      event.target.value = inputValue.slice(0, x);
      event.target.blur();
    }
  }





  async onSubmit() {
    const formData = this.myForm.value;
    const userId = this.storageService.getUserId();

    let loading;
  
    try {
      loading = await this.showLoading();
      
      const response = await this.resService.getLastContractNumFromDatabase().toPromise();
  
      if (response) {
        console.log('numero de contract response:', response.contractNum);
        this.resService.lastContractNum = response.contractNum;
        console.log('lastContractNum val:', response.contractNum);
        await this.hideLoading(loading);

      } else {
        this.resService.lastContractNum = '23-00000000';
        await this.hideLoading(loading);

      }
      formData.contractNum = this.resService.generateContractNum();
      const result = await this.resService.addReservation(userId,formData).toPromise();
  
      this.savedInstance = Number(result);
      console.log(this.savedInstance);
      console.log('Form submitted successfully');
                this.myForm.reset();
      this.openModalReg();
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
  
    const latitude = coordinates.coords.latitude;
    const longitude = coordinates.coords.longitude;

    this.myForm.controls['latitude'].setValue(coordinates.coords.latitude);
    this.myForm.controls['longitude'].setValue(coordinates.coords.longitude);
    const options = {
      latitude: latitude, // Example latitude
      longitude: longitude // Example longitude
    };
    console.log(options);
    //const adress = await NativeGeocoder.reverseGeocode(options);
    //console.log(adress)
    const adress = await NativeGeocoder.reverseGeocode(options);
    console.log(adress)
    const num = adress.addresses[0].subThoroughfare;
    const ville = adress.addresses[0].locality;
    const avenue = adress.addresses[0].thoroughfare;
    const deleg = adress.addresses[0].administrativeArea;
    const postal = adress.addresses[0].postalCode;

    const adress_final = `${num} ${avenue} ${ville} ${deleg} ${postal}`;

    this.myForm.controls['adresse'].setValue(adress_final);
    //const gouvernorat = 
    this.myForm.controls['ville'].setValue(adress.addresses[0].subAdministrativeArea);
    this.myForm.controls['codePostal'].setValue(postal);
    this.myForm.controls['gouvernorat'].setValue(adress.addresses[0].administrativeArea);
    this.myForm.controls['localite'].setValue(adress.addresses[0].locality);
    this.myForm.controls['delegation'].setValue(adress.addresses[0].subAdministrativeArea);
    console.log(ville)

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