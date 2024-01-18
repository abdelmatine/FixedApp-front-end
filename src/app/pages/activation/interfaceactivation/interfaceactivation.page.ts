import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule,Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController } from '@ionic/angular';
import {  ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../login/services/storage.service';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { ModalmapPage } from '../../reservations/components/modalmap/modalmap.page';

@Component({
  selector: 'app-interfaceactivation',
  templateUrl: './interfaceactivation.page.html',
  styleUrls: ['./interfaceactivation.page.scss'],
  standalone: true,
  imports: [IonicModule,
     CommonModule,
     FormsModule,
     ReactiveFormsModule]
})
export class InterfaceactivationPage implements OnInit {
  selectedNationalite: any;
  otherNationalite: any;
  prospector: FormGroup ;

  actId: number = 0;

  place: 'CIN' | 'PASS' | 'SEJ' = 'CIN';

  constructor(
    private router: Router,
    private http:HttpClient,
    private modalCtrl: ModalController, 
    private storageService: StorageService,  
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,


    ) {
      this.prospector = this.formBuilder.group({
        nom: ['Sfar', Validators.required],
        prenom: ['Abdelmatine' ,Validators.required],
        adresse: ['156 sprols boumhal', Validators.required],
        numeroidentite:['09627401', Validators.required],
        naissance: ['', Validators.required],
        gouvernorat : ['Ben Arous', Validators.required],
        localite: ['Boumhal', Validators.required],
        codepostale: ['2097', Validators.required],
        delegation: ['Boumhal Bassatine', Validators.required],
        numContact: ['56757140', Validators.required],
        nationalite: ['TN', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        email: ['abdelmatinesfar@gmail.com', Validators.required],
      });

    }


  ngOnInit() {
    Geolocation.requestPermissions();

    this.route.paramMap.subscribe(params => {
      const state = window.history.state;
      this.prospector.controls['latitude'].setValue(state.lat);
      this.prospector.controls['longitude'].setValue(state.lng);
    });
  }

  navigateToOffres() {
  }

  async onSubmit(){
    this.ConfirmationFormSubmitAlert('Confirmation', 'Confirmer la submission ?');
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

        this.prospector.controls['latitude'].setValue(data.data.lat);
        this.prospector.controls['longitude'].setValue(data.data.long);

        const options = {
          latitude, // Example latitude
          longitude, // Example longitude
        };
        
        const address = await NativeGeocoder.reverseGeocode(options);
        console.log('l"adresse:'+address)

        //const gouvernorat = 
        this.prospector.controls['ville'].setValue(address.addresses[0].subLocality);
        this.prospector.controls['codePostal'].setValue(address.addresses[0].postalCode);
        this.prospector.controls['gouvernorat'].setValue(address.addresses[0].administrativeArea);
        this.prospector.controls['localite'].setValue(address.addresses[0].locality);
        this.prospector.controls['delegation'].setValue(address.addresses[0].subAdministrativeArea);
        this.prospector.controls['adresse'].setValue(address.addresses[0].subThoroughfare+' '+address.addresses[0].thoroughfare);

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

    const ville = adress.addresses[0].locality;
    const codePostal = adress.addresses[0].postalCode;
    //const gouvernorat = 
    this.prospector.controls['ville'].setValue(adress.addresses[0].subLocality);
    this.prospector.controls['codePostal'].setValue(codePostal);
    this.prospector.controls['gouvernorat'].setValue(adress.addresses[0].administrativeArea);
    this.prospector.controls['localite'].setValue(adress.addresses[0].locality);
    this.prospector.controls['delegation'].setValue(adress.addresses[0].subLocality);
    console.log(ville)

  }


  async submitForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
    const formData = this.prospector.value;
    const userId = this.storageService.getUserId();
    console.log(formData);
    this.http.post(`${environment.baseApiUrl}/api/Activation/addActivation/${userId}`, formData)
    .subscribe((response) => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          actId: response
        }
      };
      
      console.log(response);
      loading.dismiss();
      this.prospector.reset();
      this.presentAlert('Succés', 'Le client a été ajouté avec succés.');
      console.log('Form submitted successfully');
      this.router.navigate(['/offres'], navigationExtras);

    }, (error) => {
      loading.dismiss();
      this.presentAlert('Error', 'Failed to save data to the database. Please try again later.');
      console.error('Error submitting form:', error);
    });

  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
      {
        text: 'OK',
        handler: () => {
          console.log('OK clicked');
        }
      }]
    });
    await alert.present();
  }
  async ConfirmationFormSubmitAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'OK',
        handler: () => {
          this.submitForm();
        }
      }]
    });
    await alert.present();
  }
}

