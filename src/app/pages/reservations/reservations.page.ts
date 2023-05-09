import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { format, parseISO } from 'date-fns';


@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})



export class ReservationsPage implements OnInit {
lati: any;
longi: any;


  myForm: FormGroup;
  testval: string = "test";



  constructor(private formBuilder: FormBuilder, private http: HttpClient) { 
    this.myForm = this.formBuilder.group({

      boxtype: ['', Validators.required],
      abbtype: ['', Validators.required],
      civilite: ['', Validators.required],
      nationalite: ['', Validators.required],
      prenom: [this.testval, Validators.required],
      nom: ['', Validators.required],
      idtype: ['', Validators.required],
      numID: ['', Validators.required],
      naissance: ['', Validators.required],
      adresse: ['', Validators.required],
      gouvernorat: ['', Validators.required],
      delegation: ['', Validators.required],
      localite: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      email: ['', Validators.required],
      telone: ['', Validators.required],
      teltwo: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]


    });
  }

  ngOnInit() {
    Geolocation.requestPermissions();
  }



  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }


  onSubmit() {

    
    const formData = this.myForm.value;
  
    this.http.post('http://localhost:8081/SpringMvc/Prospection/addProspection', formData).subscribe(() => {
      console.log('Form submitted successfully');
    }, (error) => {
      console.error('Error submitting form:', error);
    });
  }

  getCurrentLocation = async () => {  
    const coordinates = await Geolocation.getCurrentPosition();
  
    this.lati = coordinates.coords.latitude;  
    this.longi = coordinates.coords.longitude; 
    this.myForm.controls['latitude'].setValue(this.lati);
    this.myForm.controls['longitude'].setValue(this.longi);

  }





}
