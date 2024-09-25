import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class ScanPage implements OnInit {

  validationID: FormGroup;


  submissionType: any ;
  scanfront:  boolean = false;
  scanback:  boolean = false;
  photoTaken: boolean = false;

  showInput = false;
  ImageSourceRecto:any;
  ImageSourceVerso:any;

  contractData: any;
  mage: any;
  latitude: number | undefined;
  longitude: number | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router
  ) { 
    this.validationID = this.formBuilder.group({
      imageRec: [''],
      imageVers: ['']
    });
  }

  ngOnInit() {  
    const state = this.router.getCurrentNavigation()!.extras.state;
    if (state) {
      this.latitude = state['lat'];
      this.longitude = state['lng'];
      console.log(this.latitude, this.longitude);
    }

    this.route.queryParams.subscribe(params => {
      this.submissionType = params['type'];
      console.log(this.submissionType);
    });

  }


    onSubmit(){
     // this.sendImageData(this.ImageSourceRecto);
     const navigationExtras: NavigationExtras = {
      state: {
        lat: this.latitude,
        lng: this.longitude,
      },
      queryParams: {
        type: this.submissionType,
      },
    };
    this.router.navigate(['/reservations'], navigationExtras); 
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
      console.log(this.ImageSourceRecto);
      
      this.scanfront = true;
      this.photoTaken = true;
      this.validationID.get('imageRec')!.markAsTouched();

    }
    takePictureVerso = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source:CameraSource.Prompt
      });
      this.ImageSourceVerso= image.dataUrl;
      this.scanback = true;
      this.photoTaken = true;
      this.validationID.get('imageVers')!.markAsTouched();

      console.log(this.ImageSourceVerso);

    };



}
