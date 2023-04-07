import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.page.html',
  styleUrls: ['./sla.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SlaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
