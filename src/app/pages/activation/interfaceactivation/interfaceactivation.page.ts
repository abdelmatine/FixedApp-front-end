import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule,Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import {  Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

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

  place: 'CIN' | 'PASS' | 'SEJ' = 'CIN';

  constructor(private router: Router,private http:HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,


    ) {
      this.prospector = this.formBuilder.group({
        nom: ['', Validators.required],
        prenom: ['' ,Validators.required],
        adresse: ['', Validators.required],
        numeroidentite:['', Validators.required],
        naissance: ['', Validators.required],
        gouvernorat : ['', Validators.required],
        localite: ['', Validators.required],
        codepostale: ['', Validators.required],
        delegation: ['', Validators.required],
        numContact: ['', Validators.required],
        nationalite: ['', Validators.required],
        email: ['', Validators.required],
      });

    }


  ngOnInit() {
  }
  navigateToOffres() {
    this.router.navigate(['/offres']);
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
    this.http.post('http://localhost:8080/Activation/add', formData)
    .subscribe((response) => {
      loading.dismiss();
      this.prospector.reset();
      this.presentAlert('Success', 'Votre demande  a été envoyée avec succès.');
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

