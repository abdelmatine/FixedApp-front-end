import { Component, OnInit, EventEmitter, Output, Input, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../../reservations/services/reservation.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
  standalone: true,
  providers: [ReservationService],
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

  contractData: any;
  mage: any;
  latitude: number | undefined;
  longitude: number | undefined;


  constructor(
    private resService: ReservationService,
    private route: ActivatedRoute, 
    private http:HttpClient,
    private router: Router ){   }



  
    fetchContractData() {
      this.resService.getContractData()
        .then(data => {
          this.mage = data;
          this.mage.image1 = 'data:image/png;base64,' + data.image1;
          this.mage.image2 = 'data:image/png;base64,' + data.image2;
          this.mage.image3 = 'data:image/png;base64,' + data.image3;
          this.mage.image4 = 'data:image/png;base64,' + data.image4;

          //console.log(this.mage.image1);
          // Handle the received data as per your requirement
        })
        .catch(error => {
          console.error('Error fetching contract data:', error);
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
    this.router.navigate(['/formulaire'], navigationExtras); 
    }

    toggleInput() {
      this.showInput = !this.showInput;
    }

    takePictureRecto = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source:CameraSource.Prompt
      });
      this.ImageSourceRecto= image.base64String;
      
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


    /*async captureImage() {
      try {
        const image = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          quality: 90
        });
    
        const validImage = image.base64String;
    
        // Call the method to upload the contract with the image
        this.uploadContract(validImage);
      } catch (error) {
        console.error('Error capturing image:', error);
        // Handle error cases
      }
    }
    
    uploadContract(image: string | undefined) {
      const url = 'http://localhost:8080/SpringMVC/Contract/addContract'; // Replace with your Spring Boot API endpoint
    
      if (image) {
        const contractData = {
          image1: image
        };
    
        this.http.post(url, contractData).subscribe(
          response => {
            console.log('Contract uploaded successfully');
            // Handle any additional logic after successful contract upload
          },
          error => {
            console.error('Error uploading contract:', error);
            // Handle error cases
          }
        );
      } else {
        console.error('No valid image captured');
        // Handle case where no valid image is available
      }
    }
    
    
    
    
    
        async captureImages() {
    
      try {
        const images: (string | undefined)[] = [];
    
        for (let i = 0; i < 4; i++) {
          const image = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 90
          });
    
          images.push(image.base64String);
        }

        const validImages = images.filter(image => image !== undefined) as string[];
    
        // Call the method to upload the contract with the images
        this.uploadContract(validImages);
      } catch (error) {
        console.error('Error capturing images:', error);
        // Handle error cases
      }
    }
    
    
    
    
        uploadContract(images: string[]) {
      const url = 'http://localhost:8080/SpringMVC/Contract/addContract';
    
      const contractData = {
        image1: images[0],
        image2: images[1],
        image3: images[2],
        image4: images[3]
      };
    
      this.http.post(url, contractData).subscribe(
        response => {
          console.log('Contract uploaded successfully');
          // Handle any additional logic after successful contract upload
        },
        error => {
          console.error('Error uploading contract:', error);
          // Handle error cases
        }
      );
    }
    */