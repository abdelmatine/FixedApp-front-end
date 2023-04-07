import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, IonInput, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  @ViewChild('form') form: NgForm | undefined;


  submissionType: 'login' | 'join' = 'login';

  constructor(private router:Router,private popoverController: PopoverController) { }

  ngOnInit() {
  }

  onSubmit() {
    const { username, password } = this.form!.value;
    if (!username || !password) return;

    if (this.submissionType === 'login') {
      console.log(1, 'handle login', username, password);
      this.router.navigate(['/home'])
      }
     else if (this.submissionType === 'join'){
      const { firstName, lastName, email, password, username, phoneNumber, confirmPassword } = this.form!.value;
      if (!firstName || !lastName || !email || !password || !username || !phoneNumber || !confirmPassword) return;
      console.log(2, 'handle join', firstName, lastName, email, password, username, phoneNumber);
    }

  }


  toggleText(){
    if (this.submissionType === 'login'){

      this.submissionType = 'join'

    }else if (this.submissionType === 'join'){

      this.submissionType = 'login'


    }
  }





}
