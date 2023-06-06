import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
   lastContractNum: string ='';


  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    ) {
  }


  validerSignature(resID: number, signatureData: string) {
    const obj = { res: resID }; // Create an object with the resID
    return this.http.post(`${environment.baseApiUrl}/Reservation/addSignature`, { signature: signatureData, ...obj });
  }


  getLastContractNumFromDatabase(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}/Reservation/getLastReservation`);
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



  addReservation(formData: any) {
    return this.http.post(`${environment.baseApiUrl}/Reservation/addReservation`, formData);
  }




  getContractData(): Promise<any> {
    const url = 'http://localhost:8080/SpringMVC/Contract/getContract/25'; // Replace with your API endpoint

    return this.http.get(url).toPromise();
  }



  async FormPlusSignatureValidAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      backdropDismiss: false,
      buttons: []
    });

    await alert.present();

    setTimeout(async () => {
      await alert.dismiss();
    }, 2000);
  }

}
