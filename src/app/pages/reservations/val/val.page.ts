import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-val',
  templateUrl: './val.page.html',
  styleUrls: ['./val.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ValPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
