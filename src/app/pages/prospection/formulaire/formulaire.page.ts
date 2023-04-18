import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';  
import { AlertController } from '@ionic/angular';  
@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.page.html',
  styleUrls: ['./formulaire.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormulairePage implements OnInit {




  coordinates: any='';

  lati: any = '';  
  longi: any = '';  

  @ViewChild('form') form: NgForm | undefined;

  offretype: 'FO' | 'FB' | 'FJ' | 'ADSL' | 'VDSL' = 'FJ';
  zone: 'OUI' | 'NON' = 'NON';
  access: 'OUI' | 'NON' = 'NON';
  etat: 'CINT' | 'CNINT' | 'CIND' = 'CINT';
  radio: any;
  autres: any;


  


  constructor(private geolocation: Geolocation, public loadingController: LoadingController, public alertController: AlertController) { }

  ngOnInit() {
    Geolocation.requestPermissions();
  }

  onSubmit() {
    /*const { username, password } = this.form!.value;

    if (this.access === 'OUI') {
      if (!username || !password) return;

     // return this.authService.login(username, password).subscribe(() => {
      //});
      }
     else if (this.access === 'NON'){
      if(this.radio === '4'){

      }else{

      }
      const { firstName, lastName, email, phoneNumber, confirmPassword } = this.form!.value;
      if (!firstName || !lastName || !email || !password || !username || !phoneNumber || !confirmPassword) return;
      const newUser: NewUser = { username ,firstName, lastName, email, phoneNumber , password};
      return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      })
    }
    return null;*/
  }

  onSelectionChange() {
  console.log('Selected value:', this.radio);    
  }


  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();

    this.lati = this.coordinates.coords.latitude;  
    this.longi = this.coordinates.coords.longitude; 
      
    console.log('Current position:', coordinates);

   
  };






   getCurrentLocation = async () => {  
    /*const loading = await this.loadingController.create({  
      message: 'Please wait...',  
      });  
    await loading.present(); */

    this.coordinates = await Geolocation.getCurrentPosition();

    this.lati = this.coordinates.coords.latitude;  
    this.longi = this.coordinates.coords.longitude; 
  
  }  


  async showLoader(msg: string) {  
    const alert = await this.alertController.create({  
      message: msg,  
      buttons: ['OK']  
    });  
  
    await alert.present();  
  } 


}


