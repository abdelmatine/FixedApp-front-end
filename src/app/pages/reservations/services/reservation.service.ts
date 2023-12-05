import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
   lastContractNum: string ='00';
   

   //apiUrl = 'http://172.19.3.47:8080/SpringMVC';
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    ) {
  }


  validerSignature(userId:number | null, resID: number, signatureData: string) {
    const obj = { res: resID }; // Create an object with the resID
    return this.http.post(`${environment.baseApiUrl}/api/Reservation/addSignature/${userId}`, { signature: signatureData, ...obj });
  }


  getLastContractNumFromDatabase(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}/api/Reservation/getLastReservation`);
  }
  

  generateContractNum(): string {
    const year = new Date().getFullYear().toString().slice(-2);
    console.log('Year:', year);
    let lastNum = Number(this.lastContractNum.slice(3));
    console.log('lastNum init: ', lastNum)

    // Increment the lastNum by 1
    lastNum++;
    console.log('LastNum++: ', lastNum)

    // Pad the incremented number with leading zeros
    const paddedNum = lastNum.toString().padStart(8, '0');
    console.log('paddedNum: ', paddedNum)

    // Construct the contractNum string
    this.lastContractNum = `${year}-${paddedNum}`;
    console.log('lastContNum final: ', this.lastContractNum)

    return this.lastContractNum;
  }



  addReservation(userId:number | null, formData: any) {
    return this.http.post(`${environment.baseApiUrl}/api/Reservation/addReservation/${userId}`, formData);
  }


//172.19.3.47

  getContractData(): Promise<any> {
    const url = `${environment.baseApiUrl}/api/Contract/getContract/25`; // Replace with your API endpoint

    return this.http.get(url).toPromise();
  }



  async FormPlusSignatureValidAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
          },
        },
      ]
    });

    await alert.present();

  }

}
