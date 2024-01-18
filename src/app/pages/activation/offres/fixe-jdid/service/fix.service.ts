import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixService {
  lastContractNum: string ='00';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
  ) { }

  getLastContractNumFromDatabase(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}/api/FixeJdid/getLastFix`);
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
}
