import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ProspectionServiceService } from './services/prospection.service.service';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ProspService } from './services/prosp.service';
import { Router } from '@angular/router';





@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.page.html',
  styleUrls: ['./formulaire.page.scss'],
  providers: [ProspectionServiceService,ProspService],
  standalone: true,
  imports: [IonicModule, 
            CommonModule, 
            FormsModule,
            HttpClientModule,
            ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormulairePage implements OnInit {


  lati: any | undefined;  
  longi: any ;  

  coordinates: any;
  prospector: FormGroup ;
  showBackdrop = true;


  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private http:HttpClient,
    private router: Router, 
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private pPS: ProspService)
    
    { 


      this.prospector = this.formBuilder.group({
        offreType: ['', Validators.required],
        fullName: ['', Validators.required],
        numID: ['', Validators.required],
        contractNum: ['', Validators.required],
        residenceName: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        zone: ['', Validators.required],
        access: [''],
        bloc: [''],
        etage: [''],
        appartement: [''],
        raison: [''],
        autres: [''],
        etat: ['', Validators.required],


      }, { validator: this.validateCouverture });

    }




    validateCouverture(group: FormGroup) {
      if(group.controls['zone'].value === 'Zone Couverte'){
        const accessControl = group.controls['access'];
        accessControl.setValidators([Validators.required]);

        if (group.controls['access'].value === 'SANS') {
          const raisonControl = group.controls['raison'];
          raisonControl.setValidators([Validators.required]);

          if(group.controls['raison'].value === 'Autres'){
            const autresControl = group.controls['autres'];
            autresControl.setValidators([Validators.required]);
           // group.controls['access'].setValue(group.controls['autres'].value);
          }
  
          raisonControl.setValidators([Validators.required]);
        }

      }

    }

  ngOnInit() {
    Geolocation.requestPermissions();
  }







   getCurrentLocation = async () => {  
    const coordinates = await Geolocation.getCurrentPosition();

    this.lati = coordinates.coords.latitude;  
    this.longi = coordinates.coords.longitude; 
    this.prospector.controls['latitude'].setValue(parseFloat(this.lati));
    this.prospector.controls['longitude'].setValue(this.longi);
  
  }
  
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Data added succesfully',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  goToProspection(){
    this.router.navigate(['/prospection']);
  }


  gotoHome() {
    this.prospector.reset();
    this.router.navigate(['/home']);
  }





  async onSubmit(){
    this.ConfirmationFormSubmitAlert('Confirmation', 'Confirmer la submission ?');
  }


  async submitForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
    const formData = this.prospector.value;
    console.log(formData);
    this.http.post('http://localhost:8080/SpringMVC/Prospection/addProspection', formData)
    .subscribe((response) => {
      loading.dismiss();
      this.prospector.reset();
      this.presentAlert('Success', 'Votre demande de prospection a été envoyée avec succès.');
      console.log('Form submitted successfully');
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
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
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


  customCounterFormatter(inputLength: number, maxLength: number) {
  
    return `${maxLength - inputLength} characters remaining`;
  }

      onSelectionChange() {
  console.log('Selected value:', this.prospector.controls['raison'].value);    
  }



  ///////////////////CONFIRMATION TOAST CODE///////////////
  /*async presentConfirmationToast() {
  this.showBackdrop = false; // show backdrop to prevent user interaction
  const toast = await this.toastController.create({
    message: 'Are you sure you want to submit?',
    position: 'bottom',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.showBackdrop = false; // hide backdrop when toast is dismissed
        },
      },
      {
        text: 'Submit',
        handler: () => {
          this.submitForm();
          this.showBackdrop = false; // hide backdrop after form is submitted
        },
      },
    ],
  });
  await toast.present();
}*/

  

}




