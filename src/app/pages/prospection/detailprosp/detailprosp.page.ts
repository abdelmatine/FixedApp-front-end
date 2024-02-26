import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detailprosp',
  templateUrl: './detailprosp.page.html',
  styleUrls: ['./detailprosp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class DetailprospPage implements OnInit {

  @Input() itemDetails: any;
  prospector: FormGroup ;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder) { 
    this.prospector = this.formBuilder.group({
      offreType: [''],
      fullName: ['', Validators.required],
      numID: ['', Validators.required],
      contactNum: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      adresse: ['', Validators.required],
      zone: ['', Validators.required],
      access: [''],
      residenceName: [''],
      bloc: [''],
      etage: [''],
      appartement: [''],
      raison: [''],
      autres: [''],
      etat: ['', Validators.required],


    });
  }

  ngOnInit() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  async onSubmit(){  }

}
