import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NewUser } from './models/newUser.model';

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


  passwordMismatch = false;
  passwordMatched = false;

  submissionType: 'login' | 'join' = 'login';
  showPassword = false;

  constructor(private router:Router, private authService: AuthService) { }

  ngOnInit() {
  }


  onSubmit() {
    const { username, password } = this.form!.value;

    if (this.submissionType === 'login') {
      if (!username || !password) return;
      //this.router.navigateByUrl('/home');
      console.log(username, password)
     // return this.authService.login(username, password).subscribe(() => {
      //});
      }
     else if (this.submissionType === 'join'){
      const { firstName, lastName, email, phoneNumber, confirmPassword } = this.form!.value;
      if (!firstName || !lastName || !email || !password || !username || !phoneNumber || !confirmPassword) return;
      const newUser: NewUser = { username ,firstName, lastName, email, phoneNumber , password};
      
      console.log(newUser);
      
      /*return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });*/
    }
    return null;
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
