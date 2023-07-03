import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-detail-reservation',
  templateUrl: './detail-reservation.page.html',
  styleUrls: ['./detail-reservation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailReservationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
