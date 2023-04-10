import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapsPage implements OnInit {
  coordonees: any = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }


  runHttp(){
    this.http.get('http://localhost:8080/api/tutorials')

    .subscribe(async data => {

      console.log();
      this.coordonees = data;
    });

}

}
