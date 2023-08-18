import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import Swiper from 'swiper';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';




@Component({
  selector: 'app-flashbox',
  templateUrl: './flashbox.page.html',
  styleUrls: ['./flashbox.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class FlashboxPage implements OnInit {
  lati: any = null;
  longi: any = null;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  adress: any;
  constructor(private formBuilder: FormBuilder,private alertCtrl: AlertController,
    private router: Router,  private route: ActivatedRoute,private http: HttpClient

    ) { }

    selectedGouvernoratInstallation: string | undefined;
    selectedGouvernorat: string | undefined;
  gouvernorats: string[] = [
    'Ariana',
    'Beja',
    'Ben Arous',
    'Bizerte',
    'Gabes',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kebili',
    'Kef',
    'Mahdia',
    'Manouba',
    'Medenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis',
    'Zaghouan'
  ];
  showAddressFields: boolean = false;
  searchResults: any | null = null;
  selectedMsisdn: string | undefined;
  availableMsisdns: string[] = [];
  error: string| undefined;


  flashbox: FormGroup = this.formBuilder.group({
    nom:['',Validators.required],
    dateNaissance:['',Validators.required],
    gouvernorat:['',Validators.required],
    localite:['',Validators.required],
    codepostal:['',Validators.required],
    adresseInstallation:['',Validators.required],
    adresseFacturation:['',Validators.required],
    delegation:['',Validators.required],
    rdv:['',Validators.required],
    email:['',Validators.required],
    contact: ['', [
      Validators.required,
      Validators.maxLength(8),
      Validators.pattern('^[0-9]+$')
    ]],
    latitude: [this.lati, Validators.required],
    longitude: [this.longi, Validators.required],
    civilite:['',Validators.required],
    offres:['',Validators.required],
    msisdn:['',Validators.required],
    debit:['',Validators.required],
    isChecked:[''],
    ont: [''],
    sn: [''],
    prenom:['',Validators.required],
    gouvernoratInstallation:['',Validators.required],
    localiteInstallation:['',Validators.required],
    codepostalInstallation:['',Validators.required],
    delegationInstallation:['',Validators.required],
  });
  civilites: string[] = ['Monsieur', 'Mme', 'Mlle'];

  ngOnInit() {
  }
  onInput(event: any) {
    const inputValue: string = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Supprime tous les caractères non numériques

    if (numericValue.length >= 8) {
      event.target.value = numericValue.slice(0, 8); // Tronque l'entrée à la longueur maximale de 8
      event.target.blur(); // Supprime le focus de l'entrée
    } else {
      event.target.value = numericValue; // Met à jour la valeur avec les chiffres uniquement
    }
  }
  snImageSource:string | null = null;
  ontImageSource:string | null = null;
  preuvesImageSource:string| null = null;
  contratImageSource:string| null = null;
  conditionsImageSource:string| null = null;
  justificatifImageSource:string| null = null;

  exitCapture(type: string) {
    if (type === 'sn') {
      this.snImageSource = null;
    }else if (type === 'ont') {
      this.ontImageSource = null;
    }else if (type === 'preuves'){
      this.preuvesImageSource = null;
    }else if (type === 'contrat'){
      this.contratImageSource = null ;
    } else if (type === 'conditions'){
      this.conditionsImageSource = null;
    }else if (type === 'justificatif'){
      this.justificatifImageSource= null;
    }
  }
  private captureImages = async () => {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

  };
  isFormValid: boolean = false;

  async captureImage(type: string) {
    try {
      const image = await this.captureImages();
      const captureDateTime = new Date().toLocaleString();
      const validImages = image.dataUrl;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);

          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;

          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');

          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

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

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable correspondante en fonction du type
            if (type === 'sn') {
              this.snImageSource = resizedImageDataWithDateTime;
              this.snImageCaptured = true;
            } else if (type === 'ont') {
              this.ontImageSource = resizedImageDataWithDateTime;
              this.ontImageCaptured = true;
            } else if (type ==='preuves'){
              this.preuvesImageSource = resizedImageDataWithDateTime;
              this.preuvesImageCaptured = true;
            } else if (type === 'contrat'){
              this.contratImageSource = resizedImageDataWithDateTime;
              this.contratImageCaptured = true;
            }else if (type === 'conditions'){
              this.conditionsImageSource = resizedImageDataWithDateTime;
              this.conditionsImageCaptured = true;
            } else if (type === 'justificatif'){
              this.justificatifImageSource = resizedImageDataWithDateTime;
              this.justificatifImageCaptured = true;
            }
            else {
              console.error('Type d\'image invalide.');
            }
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };
      if (validImages) {
        img.src = validImages;
        return img; // Return the captured image data
      } else {
        console.error('Données base64 invalides pour l\'image capturée.');
        return null; // Return null if image capture failed
      }
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
      return null; // Return null if an error occurred during image capture
    }
  }

  snImageCaptured = false;
  ontImageCaptured = false;
  preuvesImageCaptured = false;
  contratImageCaptured = false;
  conditionsImageCaptured =false;
  justificatifImageCaptured =false;


  async sn() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);

          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;

          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');

          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

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

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.snImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }
  async justificatif() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);

          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;

          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');

          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

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

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.snImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }
  async preuves() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);
          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;
          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');
          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

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

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.preuvesImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }
  async conditions() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);
          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;
          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');
          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

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

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.conditionsImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }
  async contrat() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 90,
      });

      const captureDateTime = new Date().toLocaleString();
      const validImages = image.base64String;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const dateTimeText = captureDateTime;
          context.font = '20px Arial';
          context.fillStyle = 'white';
          context.fillText(dateTimeText, 10, 30);

          const reductionFactor = 0.5;
          const desiredWidth = canvas.width * reductionFactor;
          const desiredHeight = canvas.height * reductionFactor;

          const resizedCanvas = document.createElement('canvas');
          const resizedContext = resizedCanvas.getContext('2d');

          if (resizedContext) {
            resizedCanvas.width = desiredWidth;
            resizedCanvas.height = desiredHeight;

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

            const resizedImageDataWithDateTime = resizedCanvas.toDataURL('image/jpeg', 0.9);

            // Enregistrez l'image capturée dans la variable preuveImageSource
            this.contratImageSource = resizedImageDataWithDateTime;
          } else {
            console.error('Impossible d\'obtenir le contexte du canvas réduit.');
          }
        }
      };

      img.src = 'data:image/jpeg;base64,' + validImages;
    } catch (error) {
      console.error('Erreur lors de la capture d\'images :', error);
    }
  }
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
  correspondances: { [key: string]: string } = {
    'Ariana': '2080',
    'Beja': '9000',
    'Ben Arous': '2013',
    'Bizerte': '7000',
    'Gabes': '6000',
    'Gafsa': '2100',
    'Jendouba': '8100',
    'Kairouan': '3100',
    'Kasserine': '1200',
    'Kebili': '4200',
    'Kef': '7100',
    'Mahdia': '5100',
    'Manouba': '2010',
    'Medenine': '4100',
    'Monastir': '5000',
    'Nabeul': '8000',
    'Sfax': '3000',
    'Sidi Bouzid': '9100',
    'Siliana': '6100',
    'Sousse': '4000',
    'Tataouine': '3200',
    'Tozeur': '2200',
    'Tunis': '1000',
    'Zaghouan': '1100',
  };

  updateCodePostal() {
    if (this.selectedGouvernorat !== undefined) {
      const codePostal = this.correspondances[this.selectedGouvernorat];
      this.flashbox.controls['codepostal'].setValue(codePostal);
    }
  }
  updateCodepostalInstallation() {
    if (this.selectedGouvernoratInstallation !== undefined) {
      const codepostalInstallation = this.correspondances[this.selectedGouvernoratInstallation];
      this.flashbox.controls['codepostalInstallation'].setValue(codepostalInstallation);
    }
  }


  async getActualPosAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Confirmer',
        handler: () => {
          this.getCurrentLocation();
        }
      }]
    });
    await alert.present();
  }
  getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lati = position.coords.latitude;
          this.longi = position.coords.longitude;
          this.flashbox.controls['latitude'].setValue(parseFloat(this.lati));
          this.flashbox.controls['longitude'].setValue(parseFloat(this.longi));
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  submitImages() {
    // Récupérez les données des images capturées
    const preuvesImageData = this.preuvesImageSource;
    const contratImageData = this.contratImageSource;
    const conditionsImageData = this.conditionsImageSource;
    const justificatifImageData = this.justificatifImageSource;

    // Ajoutez ici le code pour envoyer les données des images capturées au backend
    const uploadImageData = {
      preuves: preuvesImageData,
      contrat: contratImageData,
      conditions: conditionsImageData,
      justificatif: justificatifImageData
    };

    this.http.post('http://localhost:8080/FlashBox/uploadImages', uploadImageData)
      .subscribe(
        response => {
          console.log('Images enregistrées avec succès !');
        },
        error => {
          console.log('Une erreur s\'est produite lors de l\'enregistrement des images :', error);
        }
      );
  }

  submit() {
    const formData = this.flashbox.value;
    this.http.post('http://localhost:8080/FlashBox/add', formData)
      .subscribe(
        response => {
          console.log('Données enregistrées avec succès !');

          // Appeler la méthode pour soumettre les images capturées
          this.submitImages();
        },
        error => {
          console.log('Une erreur s\'est produite lors de l\'enregistrement des données :', error);
        }
      );
  }


  async suivant() {
    const formData = this.flashbox.value;
    formData.isChecked = this.isChecked ? 'Level 4' : null;

    // Afficher la boîte de dialogue d'alerte
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir enregistrer ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            // Action à effectuer lors de l'annulation
          }
        },
        {
          text: 'Confirmer',
          handler: () => {
            // Effectuer la requête HTTP
            this.http.post('http://localhost:8080/FlashBox/add', formData)
              .subscribe(
                response => {
                  console.log('Données enregistrées avec succès !');

                  // Naviguer vers une autre page
                  this.router.navigate(['/reglement'], {
                    queryParams: { source: 'flashbox' }
                  });
                },
                error => {
                  console.log('Une erreur s\'est produite lors de l\'enregistrement des données :', error);
                }
              );
          }
        }
      ]
    });

    // Afficher la boîte de dialogue d'alerte
    await alert.present();
  }



  isChecked: 'Level 4' | null = null;
  levelValue: string = "Level 4";

  toggleLevel4() {
    this.isChecked = this.isChecked === 'Level 4' ? null : 'Level 4';
  }



  searchMsisdn(event: any) {
    const msisdnControl = this.flashbox.get('msisdn');
    const msisdn = event.target.value || '';
    const url = `http://localhost:8080/FlashBox/search?msisdn=${msisdn}`;

    this.http.get(url).subscribe((result: any) => {
      this.searchResults = result || [];
      this.selectedMsisdn = '';
      this.error = '';

      // Créer un tableau pour stocker les MSISDN déjà affichés
      const displayedMsisdns: string[] = [];

      // Filtrer les résultats pour n'afficher qu'une seule fois chaque MSISDN
      this.searchResults = this.searchResults.filter((item: any) => {
        if (!displayedMsisdns.includes(item.msisdn)) {
          displayedMsisdns.push(item.msisdn);
          return true;
        }
        return false;
      });

      if (msisdn === '') {
        this.searchResults = [];
      }

      if (this.searchResults.length === 0 && msisdn !== '') {
        this.error = 'Le MSISDN n\'existe pas.';
      }
    });
  }


  selectMsisdn(msisdn: string) {
    this.checkMsisdnAvailability(msisdn)
      .then((msisdnDisponible: boolean) => {
        if (msisdnDisponible) {
          this.flashbox.patchValue({ msisdn: msisdn });
          this.error = '';
        } else {
          this.selectedMsisdn = '';
          this.error = 'Le MSISDN n\'est pas disponible.';
          this.fetchAvailableMsisdns();
        }
      })
      .catch((error: any) => {
        console.error('Error checking MSISDN availability:', error);
        this.selectedMsisdn = '';
        this.error = 'Une erreur s\'est produite lors de la vérification de la disponibilité du MSISDN.';
      });
  }

  fetchAvailableMsisdns() {
    const url = 'http://localhost:8080/FlashBox/getAvailableMsisdns'; // Replace with the appropriate API endpoint

    this.http.get(url)
      .toPromise()
      .then((result: any) => {
        // Update the list of available MSISDNs
        this.availableMsisdns = result;
      })
      .catch((error: any) => {
        console.error('Error fetching available MSISDNs:', error);
      });
  }

  checkMsisdnAvailability(msisdn: string): Promise<boolean> {
    const url = `http://localhost:8080/FlashBox/search?msisdn=${msisdn}`;

    return this.http.get(url)
      .toPromise()
      .then((result: any) => {
        // Check if the result contains any MSISDNs
        if (result && result.length > 0) {
          // MSISDN is available
          return true;
        } else {
          // MSISDN is not available
          return false;
        }
      })
      .catch((error: any) => {
        console.error('Error checking MSISDN availability:', error);
        throw new Error('Une erreur s\'est produite lors de la vérification de la disponibilité du MSISDN.');
      });
  }




}