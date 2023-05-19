import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  myForm: FormGroup;
  isSubmitting = false;

  eligibility: string | undefined; // Declare eligibility property
  capability: string | undefined; // Declare capability property
  reason: string | undefined; // Declare reason property

  constructor(    
    private fb: FormBuilder,
    private http: HttpClient) {
      this.myForm = this.fb.group({
        name: ['', Validators.required],
        eligibility: [''],
        capability: [''],
        phone: [''],
        reason: ['']
      });
     }

  ngOnInit() {
  }

  submitForm() {
    console.log("you are here");

    if (this.myForm.valid && !this.isSubmitting) {
      console.log("you are there");
      this.isSubmitting = true;
      const formData = this.myForm.value;
      console.log(formData);

    }
  }

}
