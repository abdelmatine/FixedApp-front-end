import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
import {  AlertController, IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/pages/login/services/storage.service';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
  standalone: true,
  providers: [ReservationService],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfirmationPage implements OnInit {
  @Input() resID!: number;
  @Output() done!: boolean;

  @ViewChild('signaturePad') signaturePad: any;

  private signaturePadOptions: Object = { // options de signature_pad
    backgroundColor: '#ffffff',
    penColor: '#000000',
    minWidth: 2,
    maxWidth: 4,
  };

  private canvas: any;
  private signaturePadInstance: any;
  signatureImage!: string;

  constructor(
    private alertController: AlertController,
    private storageService: StorageService,
    private resService: ReservationService,
    private modalController: ModalController,) 
    { }

  ngOnInit() {

    console.log(this.resID);

  }

  cancel() {
    this.modalController!.dismiss(null, 'cancel');
  }



  public clear() {
    this.signaturePadInstance.clear();
  }

  ngAfterViewInit() {

    this.canvas = this.signaturePad.nativeElement;
    this.signaturePadInstance = new SignaturePad(this.canvas, this.signaturePadOptions);

    //this.canvas.ontouchstart = this.handleTouchStart;
  }





  public displaySignatureImage(imageBlob: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataURL = reader.result as string;
      this.signatureImage = imageDataURL;
    };
    reader.readAsDataURL(imageBlob);
  }

  isCanvasEmpty(): boolean{
    return this.signaturePadInstance.isEmpty();
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
  
  async Valider() {
    const dataURL = this.signaturePadInstance.toDataURL();
    const resID = this.resID; 
    const userId = this.storageService.getUserId();

    const loadingAlert = await this.presentLoading('Enregistrement...'); // Show loading spinner for login

    try {
      await this.resService.validerSignature(userId,resID, dataURL).toPromise();
      console.log('Signature saved successfully!');
      loadingAlert.dismiss(); // Dismiss loading spinner

      // Show success alert using AlertService
      this.resService.FormPlusSignatureValidAlert('Félicitation! Votre demande de réservation a été soumise avec succès');
  
      // Close the modal and reset the form after the alert disappears
      setTimeout(async () => {
        await this.modalController.dismiss();
      }, 1500);
    } catch (error) {
      console.error('Failed to save the signature:', error);
      // Handle errors if necessary
      loadingAlert.dismiss(); // Dismiss loading spinner

    }


  }
  


  handleClick(){
    this.Valider();
    this.cancel();
  }
  

  /*Valider() {
    const dataURL = this.signaturePadInstance.toDataURL();
    this.formData.signatureImage.setValue(dataURL);
    this.http.post('http://localhost:8080/SpringMVC/Reservation/add', this.formData)
    .subscribe(() => {
      console.log('Form submitted successfully');
    }, (error) => {
      console.error('Error submitting form:', error);
    });
  }*/

}


/*

*/