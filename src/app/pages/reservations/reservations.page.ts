import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Swiper } from 'swiper';
import { ReservationService } from './services/reservation.service';
import { ConfirmationPage } from './components/confirmation/confirmation.page';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
  standalone: true,
  providers: [ReservationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})



export class ReservationsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  latitude: any ;  
  longitude: any ;  
  adresse: any;
  savedInstance!: number;


  myForm: FormGroup;
  testval: string = "test";
  selectedDate: any;



  constructor(   
    private modalCtrl: ModalController, 
    private route: ActivatedRoute,
    private resService: ReservationService,
    private formBuilder: FormBuilder, ) 
    { 
    this.myForm = this.formBuilder.group({

      
      contractNum: [''],
      boxType: ['INDOOR', Validators.required],
      abbType: ['B2C', Validators.required],
      civilite: ['Madame', Validators.required],
      nationalite: ['TN', Validators.required],
      prenom: [this.testval, Validators.required],
      nom: ['test', Validators.required],
      idType: ['CIN', Validators.required],
      numID: ['88888888', Validators.required],
      naissance: ['', Validators.required],
      adresse: [this.adresse, Validators.required],
      gouvernorat: ['ben arous', Validators.required],
      delegation: ['boumhal', Validators.required],
      localite: ['boumhal', Validators.required],
      ville: ['boumhal', Validators.required],
      codePostal: ['2097', Validators.required],
      email: ['a@mail.tn', Validators.required],
      telOne: ['22222222', Validators.required],
      telTwo: ['55555555', Validators.required],
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
      signatureImage: ['']

    });
  }

  ngOnInit() {
    Geolocation.requestPermissions();

      this.latitude = this.route.snapshot.queryParamMap.get('latitude');
      this.longitude = this.route.snapshot.queryParamMap.get('longitude');
      this.adresse = this.route.snapshot.queryParamMap.get('adresse');

      console.log(this.latitude, this.longitude, this.adresse);
    
  }

  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
 
  goNext() {
    this.swiper?.slideNext();
  }
 
  goPrev() {
    this.swiper?.slidePrev();
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmationPage,
      componentProps: {
        resID: Number(this.savedInstance)
      }
    });

    modal.onDidDismiss().then(() => {
      this.myForm.reset();
    });

  
    await modal.present();
  }


  handleClick(){
    this.onSubmit();
    this.cancel();
  }


  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caractères restants`;
  }

  onInput(event: any) {
    const inputValue: string = event.target.value;
    if (inputValue.length >= 8) {
      event.target.value = inputValue.slice(0, 8);
      event.target.blur();
    }
  }


  onSubmit() {
    const formData = this.myForm.value;
  
    this.resService.getLastContractNumFromDatabase().pipe(
      switchMap((response: any) => {
        if (response) {
          console.log('numero de contract response:', response.contractNum);
          this.resService.lastContractNum = response.contractNum;
          console.log('lastContractNum val:', response.contractNum);
        } else {
          this.resService.lastContractNum = '23-00000000';
        }
        formData.contractNum = this.resService.generateContractNum();
        return this.resService.addReservation(formData);
      })
    ).subscribe(
      (response: any) => {
        this.savedInstance = Number(response);
        console.log(this.savedInstance);
        console.log('Form submitted successfully');
        this.openModal();
      },
      (error) => {
        console.error('Error submitting form:', error);
      }
    );
  }

  getCurrentLocation = async () => {  
    const coordinates = await Geolocation.getCurrentPosition();
  
    this.myForm.controls['latitude'].setValue(coordinates.coords.latitude);
    this.myForm.controls['longitude'].setValue(coordinates.coords.longitude);

  }





}



/*
  onSubmit() {
    const formData = this.myForm.value;
    this.contractService.getLastContractNumFromDatabase();
    formData.contractNum = this.contractService.generateContractNum();
    
    this.contractService.addReservation(formData).subscribe(
      (response: any) => {
        this.savedInstance = Number(response);
        console.log(this.savedInstance);
        console.log('Form submitted successfully');
        this.openModal();
      },
      (error) => {
        console.error('Error submitting form:', error);
      }
    );
  }
*/