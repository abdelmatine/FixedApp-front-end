import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.page.html',
  styleUrls: ['./formulaire.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormulairePage implements OnInit {





  lati: any = '';  
  longi: any = '';  

  @ViewChild('form') form: NgForm | undefined;

  offretype: 'FO' | 'FB' | 'FJ' | 'ADSL' | 'VDSL' = 'FJ';
  zone: 'OUI' | 'NON' = 'NON';
  access: 'OUI' | 'NON' = 'NON';
  etat: 'CINT' | 'CNINT' | 'CIND' = 'CINT';
  radio: any;
  autres: any;


  


  constructor() { }

  ngOnInit() {
    Geolocation.requestPermissions();
  }

  onSubmit(){
  }

  onSelectionChange() {
  console.log('Selected value:', this.radio);    
  }


  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
  
    console.log('Current position:', coordinates);
  };




}


