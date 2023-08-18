import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.page.html',
  styleUrls: ['./detail-demande.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailDemandePage implements OnInit {

  @Input() itemDetails: any;
  cgps: string = "" ;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.cgps= this.itemDetails.latitude + " ," + this.itemDetails.longitude;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
