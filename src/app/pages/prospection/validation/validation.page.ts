import { Component, OnInit, EventEmitter, Output, Input, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
    FormsModule]
})
export class ValidationPage implements OnInit {



  submissionType: any ;
  scanfront: any;
  scanback: any;

  showInput = false;
  ImageSourceRecto:any;
  ImageSourceVerso:any;

  constructor(
    private route: ActivatedRoute, 
    private http:HttpClient,
    private router: Router ){


    
  }



  
  
  ngOnInit() {  
    
    const type = this.route.snapshot.queryParamMap.get('type');
    this.submissionType = type;
    console.log(type, this.submissionType);

  }

    onSubmit(){
    this.router.navigateByUrl('/formulaire');
    }

    toggleInput() {
      this.showInput = !this.showInput;
    }

    takePictureRecto = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source:CameraSource.Prompt
      });
      this.ImageSourceRecto= image.dataUrl;
      this.scanfront = "is scanned";
    
    }

    takePictureVerso = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source:CameraSource.Prompt
      });
      this.ImageSourceVerso= image.dataUrl;
      this.scanback = "is scanned";
    
    };


}
