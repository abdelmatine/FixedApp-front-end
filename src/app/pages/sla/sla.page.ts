import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators ,FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NewUser } from '../login/models/newUser.model';
import { AuthService } from '../login/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.page.html',
  styleUrls: ['./sla.page.scss'],
  standalone: true,
  providers: [AuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [IonicModule, 
            CommonModule, 
            FormsModule, 
            HttpClientModule,
            ReactiveFormsModule]
})
export class SlaPage implements OnInit {
onSelectionChange() {
throw new Error('Method not implemented.');
}

getCurrentLocation() {
throw new Error('Method not implemented.');
}
getActualPosAlert(arg0: string,arg1: string) {
throw new Error('Method not implemented.');
}
onInput($event: Event) {
throw new Error('Method not implemented.');
}

  @ViewChild('form') form: NgForm | undefined;

  lati: any ;  
  longi: any ;
  coordinates: any;
customCounterFormatter: any;


  constructor(
    private alertCtrl: AlertController,
    private http:HttpClient,
    private loadingCtrl: LoadingController,
    private router: Router, 
    private authService: AuthService) 
  {
    
   }

  ngOnInit() {

  }

  //raison: any;

  zone : 'Zone Couverte' | 'Zone Non Couverte' = 'Zone Non Couverte';
  access: 'AVEC' | 'SANS' = 'SANS';

  passwordMismatch = false;
  passwordMatched = false;

  submissionType: 'login' | 'join' = 'login';
  showPassword = false;

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: []
    });
    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 2000);
  }

  gotoHome() {
    this.router.navigate(['/home']);
  }



  async onSubmit() {
    const { username, password } = this.form!.value;

    if (this.submissionType === 'login') {
      if (!username || !password) return;
      //this.router.navigateByUrl('/home');
      console.log(username, password);

     // return this.authService.login(username, password).subscribe(() => {
      //});
      }
     else if (this.submissionType === 'join'){
      const { firstName, lastName, email, phoneNumber, confirmPassword } = this.form!.value;
      if (!firstName || !lastName || !email || !password || !username || !phoneNumber || !confirmPassword) return;
      const newUser: NewUser = { username ,firstName, lastName, email, phoneNumber , password};
      const loading = await this.loadingCtrl.create({
        message: 'Veuillez patienter...',
      });
      await loading.present();
      console.log(newUser);
      this.http.post('http://localhost:8080/SpringMVC/Login/addLogin', newUser)
      .subscribe((response) => {
        loading.dismiss();
        this.presentAlert('Succès', 'Votre demande de prospection a été envoyée avec succès.');
        console.log('Form submitted successfully');
      }, (error) => {
        loading.dismiss();
        this.presentAlert('Erreur', 'Échec de l"enregistrement des données dans la base de données. Veuillez réessayer plus tard.');
        console.error('Error submitting form:', error);
      });
      
      /*return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });*/
    }
    //return null;
  }



  toggleText(){
    if (this.submissionType === 'login'){

      this.submissionType = 'join'

    }else if (this.submissionType === 'join'){

      this.submissionType = 'login'


    }
  }




  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  validatePassword() {

    if (this.submissionType === 'join'){

      const { firstName, lastName, email, password, username, phoneNumber, confirmPassword } = this.form!.value;

      if (password === confirmPassword) {
        this.passwordMismatch = false;
        this.passwordMatched = true;
      } else {
        this.passwordMismatch = true;
        this.passwordMatched = false;
      }

    }

  }


}
