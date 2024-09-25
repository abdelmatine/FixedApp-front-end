import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as Leaflet from 'leaflet';
import { NavigationExtras, Router } from '@angular/router';
import 'leaflet-control-geocoder';
import GeocoderControl from 'leaflet-control-geocoder';
import { LatLngTuple } from 'leaflet';
import { PopoverPage } from 'src/app/pages/maps/popover/popover.page';
import { ModalController } from '@ionic/angular';
import { NativeGeocoder } from '@capgo/nativegeocoder';

@Component({
  selector: 'app-modalmap',
  templateUrl: './modalmap.page.html',
  styleUrls: ['./modalmap.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalmapPage implements OnInit {

  map! : Leaflet.Map;
  properties: any[] = [
  ];

  maps!:any[];
  query!: string;
  private circle!: Leaflet.Circle;
  coordonees:any=[];
  caseStatus!:any;
  latitude: number | undefined;
  longitude: number | undefined;
  private serviceUrl='http://localhost:8080/Maps/maps';

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private http:HttpClient,
    private popoverController: PopoverController) {
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/Maps/maps').subscribe(data => {
      this.maps = data;
      console.log(this.maps);
    });
  }
  ionViewDidEnter(){
    if (!document.getElementById('map')) {
      return;
    }

    const map = Leaflet.map('map').setView([36.806, 10.1815], 10);
//affichage de longitude et latitude
      map.on('click', (e: Leaflet.LeafletMouseEvent) => {
        this.latitude = e.latlng.lat;
        this.longitude = e.latlng.lng;
        
        const coordinatesElement = document.getElementById('coordinates');
if (coordinatesElement) {
  coordinatesElement.innerHTML = `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
}
        const popupContent = `Latitude: ${this.latitude}<br>Longitude: ${this.longitude}`;
  const popup = Leaflet.popup()
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map);
});


    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
    if (this.maps && this.maps.length > 0) {
      this.maps.forEach(location => {
        let markerProperties = {};
        let radius = 100;
        switch (location.etat) {
          case 'ZONE_COUVERTE':
            markerProperties = {
              color: 'green',
              fillColor: 'green',
              fillOpacity: 0.5,
              radius: 10
            };
            break;
          case 'ZONE_NON_COUVERTE':
            markerProperties = {
              color: 'red',
              fillColor: 'red',
              fillOpacity: 0.5,
              radius: 10
            };
            break;
          case 'ZONE_PLANIFIER':
            markerProperties = {
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.5,
              radius: 10
            };
            break;
        }
        const latLng: LatLngTuple = [location.latitude, location.longitude];
        let circle = Leaflet.circleMarker(latLng, markerProperties).addTo(map);
        circle.bindPopup(() => {
          let popupContent = '';
          if (location.etat === 'ZONE_COUVERTE') {
            popupContent = `<span style="color:green;">ZONE COUVERTE</span>`;
          } else if (location.etat === 'ZONE_NON_COUVERTE') {
            popupContent = `<span style="color:red;">ZONE NON COUVERTE</span>`;
          } else if (location.etat === 'ZONE_PLANIFIER') {
            popupContent = `<span style="color:blue;">ZONE PLANIFIÉE</span>`;
          }
          return popupContent;
        });

        // Fetch address details
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const address = data.display_name;
            const postcode = data.address.postcode;
            const road = data.address.road;
            circle.bindPopup(`Adresse : ${address}, ${postcode} ${road}`);
          })
          .catch(error => console.error(error));
      });
    }


    map.on('click', (e) => this.ConfirmationFormSubmitAlert("Confirmation des coordonées", "Voulez vous confirmer les coordonées suivantes? "+this.latitude+", "+this.longitude));





//position actuelle
const currentPositionIcon = Leaflet.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
navigator.geolocation.getCurrentPosition(function (position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const latlng = Leaflet.latLng([latitude, longitude]);
  const marker = Leaflet.marker(latlng, { icon: currentPositionIcon }).addTo(map);
  map.setView(latlng, 13);
});


const searchControl = new GeocoderControl({
  placeholder: 'Enter address or postal code...',
  defaultMarkGeocode: true,
  collapsed: true,

}).addTo(map);

searchControl.on('markgeocode', function (e) {
  map.flyTo(e.geocode.center, 13);
  Leaflet.marker(e.geocode.center, {
  }).addTo(map);
});

const circle = Leaflet.circle([36.806,10.1815], { radius: 3000,color:'yellow',fillOpacity:0.5,fillColor:'yellow' }).addTo(map);
circle.setStyle({ fillColor: 'yellow' });

const circle1 = Leaflet.circle([36.74330053708882,10.302573760855013], { radius: 3000,color:'red',fillOpacity:0.5,fillColor:'red' }).addTo(map);
circle1.setStyle({ fillColor: 'red' });

const circle2 = Leaflet.circle([36.7459430149041,10.226672318094645], { radius: 3000,color:'red',fillOpacity:0.5,fillColor:'red' }).addTo(map);
circle2.setStyle({ fillColor: 'red' });

const circle3 = Leaflet.circle([36.69864689230568,10.261727388569854], { radius: 3150,color:'red',fillOpacity:0.5,fillColor:'red' }).addTo(map);
circle3.setStyle({ fillColor: 'red' });


}




createCustomEvent(event: L.LeafletMouseEvent): Event {
  const customEvent = new CustomEvent('leafletClick', { detail: event });
  return customEvent as Event;
}

async ConfirmationFormSubmitAlert(header: string, message: string) {
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
        const data = { lat: this.latitude, long: this.longitude };
        this.modalCtrl.dismiss({ data }, 'confirm');      }
    }]
  });
  await alert.present();
}

cancel() {
  this.modalCtrl.dismiss(null, 'cancel');
}

}
