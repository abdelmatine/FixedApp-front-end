import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, Platform } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Swiper } from 'swiper';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rac-fast-box',
  templateUrl: './rac-fast-box.page.html',
  styleUrls: ['./rac-fast-box.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RacFastBoxPage implements OnInit {
  imageSource: string = '';


  fastBox: FormGroup;
  @ViewChild('swiper')

  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private http:HttpClient,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private router: Router) {
    this.fastBox = this.formBuilder.group({
      offres: ['', Validators.required],
      debit: ['', Validators.required],
      mondatTT: [''],

    });
  }

  ImageSourceContrat: string = '';

  ngOnInit() {}
  Suivant() {
    this.swiper?.slideNext();

  }

  submit() {}

  Mondat = async () => {
    const image = await this.captureImage();
    if (image?.dataUrl) {
      const imageData = image.dataUrl.split(',')[1]; // Supprimer le préfixe MIME
      this.ImageSourceContrat = imageData;
    } else {
      console.log('No image data available');
    }
  };

  private captureImage = async () => {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

  };
  goNext() {
    this.swiper?.slideNext();
  }
  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  goPrev() {
    this.swiper?.slidePrev();
  }
  exitCapture() {
    this.imageSource = '';
  }
  captureDateTime: string | undefined;
 async captureImages() {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90,
    });

    const captureDateTime = new Date().toLocaleString();
    const validImages = image.base64String;

    // Créer un nouvel élément image
    const img = new Image();

    // Définir l'événement onload pour l'image
    img.onload = () => {
      // Créer un nouvel élément canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;

        // Dessiner l'image sur le canvas
        context.drawImage(img, 0, 0);

        // Dessiner la date et l'heure sur le canvas
        const dateTimeText = captureDateTime;
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(dateTimeText, 10, 30);

        // Définir la taille souhaitée pour la réduction de l'image
        const reductionFactor = 0.5; // Facteur de réduction, par exemple 0.5 réduit de moitié la taille

        // Calculer les nouvelles dimensions réduites
        const desiredWidth = canvas.width * reductionFactor;
        const desiredHeight = canvas.height * reductionFactor;

        // Créer un nouvel élément canvas avec la taille réduite
        const resizedCanvas = document.createElement('canvas');
        const resizedContext = resizedCanvas.getContext('2d');

        if (resizedContext) {
          // Le contexte est valide, procédez avec les opérations sur le canvas réduit
          resizedCanvas.width = desiredWidth;
          resizedCanvas.height = desiredHeight;

          // Redimensionner l'image capturée sur le nouveau canvas réduit
          resizedContext.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            desiredWidth,
            desiredHeight
          );

          // Convertir le nouveau canvas en base64
          const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

          // Utiliser resizedImageDataWithDateTime comme vous le souhaitez
          console.log('Image réduite avec date et heure:', resizedImageDataWithDateTime);

          // Afficher l'image réduite avec la date et l'heure
          this.imageSource = resizedImageDataWithDateTime;
        } else {
          console.error('Impossible d"obtenir le contexte du canvas réduit.');
        }
      }
    };

    // Définir la source de l'image sur l'image capturée
    img.src = 'data:image/jpeg;base64,' + validImages;
  } catch (error) {
    console.error('Erreur lors de la capture d"images :', error);
  }
}

displayAttributeValues() {
  console.log('Displaying attribute values...');
}

async submitForm() {

    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Confirmer?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmer',
          handler: () => {
            const formData = this.fastBox.value;

          console.log(formData);
            this.http.post('http://localhost:8080/Raccordement/add', formData)
            .subscribe(
                response => {
                  this.displayAttributeValues(); // Call the method to display attribute values
                  this.router.navigate(['/home']);
                },

              );
          }
        }
      ]
    });

    // Afficher la boîte de dialogue de confirmation
    await confirmAlert.present();
  }
}