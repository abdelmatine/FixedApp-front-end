import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertController, IonicModule, NavController, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [AuthService],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  @ViewChild('form') form: NgForm | undefined;

  isLoggedIn = false;
  isLoginFailed = false;
  


  /*form: any = {
    username: null,
    email: null,
    password: null
  };*/
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  roles: string[] = [];

  passwordMismatch = false;
  passwordMatched = false;

  submissionType: 'login' | 'join' = 'login';
  showPassword = false;

  constructor(
    private storageService: StorageService,
    private alertController: AlertController,
    private authService: AuthService,
    private navCtrl: NavController,
    private platform: Platform,

    ) { }

  ngOnInit(): void {

    this.setupBackButtonListener();

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  private setupBackButtonListener() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.presentExitAlert();
    });
  }

  async presentExitAlert() {
    const alert = await this.alertController.create({
      header: 'Quitter l"application',
      message: 'Êtes-vous sûr de vouloir quitter?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Quitter',
          handler: () => {
            App.exitApp(); // Close the app
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading(message: string) {
    const loading = await this.alertController.create({
      message: message,
      translucent: true,
      backdropDismiss: false,
      //spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }
  
  async presentSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
    });
    await alert.present();
  }
  
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async onSubmit() {
   // const { username, password } = this.form!.value;

    if (this.submissionType === 'login') {
      const { username, password } = this.form!.value;
      if (!username || !password) return;
      const loadingAlert = await this.presentLoading('Authentification...'); // Show loading spinner for login

      this.authService.login(username, password).subscribe({
        next: data => {

          loadingAlert.dismiss(); // Dismiss loading spinner
          this.presentSuccessAlert('Bienvenue!'); // Show success alert
  
          this.storageService.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          this.navCtrl.navigateRoot('/home');

        },
        error: err => {
          loadingAlert.dismiss(); // Dismiss loading spinner
          this.presentErrorAlert(err.error.message); // Show error alert with message    
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      });

      }
     else if (this.submissionType === 'join'){

      const { fullName,username, email,password, numTel,zone,nomSt } = this.form!.value;
      if (!fullName || !username || !email || !password || !numTel || !zone || !nomSt) return;
        // const newUser: NewUser = { username ,firstName, lastName, email, phoneNumber , password};
        // console.log(newUser);
        const loadingAlert = await this.presentLoading('Création du compte en cours ...'); // Show loading spinner

        
        this.authService.register(fullName,username, email,password, numTel,zone,nomSt).subscribe({
          next: data => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            loadingAlert.dismiss(); // Dismiss loading spinner
            this.presentSuccessAlert('Inscription avec succès'); // Show success alert
            this.authService.login(username, password).subscribe({
              next: data => {
                this.storageService.saveUser(data);
        
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.roles = this.storageService.getUser().roles;
                this.navCtrl.navigateRoot('/home');
      
              },
              error: err => {
                this.errorMessage = err.error.message;
                this.isLoginFailed = true;
              }
            });
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
            loadingAlert.dismiss(); // Dismiss loading spinner
            this.presentErrorAlert(err.error.message); 
          }
        });
      
      /*return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });*/
    }
  }


  
  
   /* get isUserLoggedIn(): Observable<boolean>{
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    )
  }*/
  
  


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
