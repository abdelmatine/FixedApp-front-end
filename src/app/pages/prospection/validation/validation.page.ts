import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ValidationPage implements OnInit {
  submissionType: 'CIN' | 'PASS' = 'CIN';

  constructor() { }

  

  ngOnInit() {
  }

  onSubmit(){

  }

  toggleText(){
    if (this.submissionType === 'CIN'){

      this.submissionType = 'PASS'

    }else if (this.submissionType === 'PASS'){

      this.submissionType = 'CIN'


    }
  }

}
