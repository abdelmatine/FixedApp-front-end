import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ValidationPage implements OnInit {
  
  
  submissionType: any ;
  scan: any;


  constructor(private route: ActivatedRoute, private router: Router ){}
  
  
  ngOnInit() {  

    
    const type = this.route.snapshot.queryParamMap.get('type');
    this.submissionType = type;

  }

  onSubmit(){

    this.router.navigateByUrl('/formulaire');

    }


}
