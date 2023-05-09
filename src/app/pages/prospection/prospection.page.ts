import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-prospection',
  templateUrl: './prospection.page.html',
  styleUrls: ['./prospection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HttpClientModule]
})
export class ProspectionPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal | undefined;


  badgeColor: any;

  message = 'test';
  name: string | undefined;

  place: 'CIN' | 'PASS' | 'SEJ' = 'CIN';

  constructor(private http: HttpClient, private router:Router, private modalCtrl: ModalController){ }


  prospections:any = [];

  ngOnInit() {

 
  }

  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }



  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }



  Search(){
    console.log(this.place)
    const params: NavigationExtras = {
      queryParams: {type: this.place}
    }
    this.router.navigate(['/validation'], params);
  }


  getListProspection(){
    this.http.get('http://localhost:8080/SpringMVC/Prospection/getallprospections')
    .subscribe(data => {
      console.log(data);
      this.prospections = data;
    })
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getListProspection();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

}
