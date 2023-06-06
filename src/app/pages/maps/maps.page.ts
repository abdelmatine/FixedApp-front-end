import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as Leaflet from 'leaflet';
import { NavigationExtras, Router } from '@angular/router';
import { control } from 'leaflet';
import 'leaflet-control-geocoder';
import GeocoderControl from 'leaflet-control-geocoder';
import { Observable } from 'rxjs';
import { LatLngTuple } from 'leaflet';



@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapsPage implements OnInit {
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

  constructor(private http:HttpClient,private router: Router) {
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
        console.log('Latitude: ', this.latitude);
        console.log('Longitude: ', this.longitude);
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
      map.on('click', function(e) {
        // Récupérer les coordonnées du clic
        const latlng = e.latlng;
        const latitude = latlng.lat;
        const longitude = latlng.lng;

        // Effectuer une requête Nominatim inversée pour récupérer l'adresse et le code postal
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            // Afficher l'adresse complète et le code postal dans une fenêtre contextuelle
            const address = data.display_name;
            const postcode = data.address.postcode;
            const popupContent = `Adresse : ${address}, ${postcode}`;
           //const popup = Leaflet.popup().setLatLng(latlng).setContent(popupContent).openOn(map);
          })
          .catch(error => console.error(error));
      });
    }




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

}).addTo(map);;
searchControl.on('markgeocode', function (e) {
  map.flyTo(e.geocode.center, 13);
  Leaflet.marker(e.geocode.center, {
  }).addTo(map);
});

const circle = Leaflet.circle([36.806,10.1815], { radius: 3000,color:'yellow',fillOpacity:0.5,fillColor:'yellow' }).addTo(map);
circle.setStyle({ fillColor: 'yellow' });
let ficheControlAdded = false;
let reservationControlAdded = false;
let activationSuperBoxControlAdded = false;
let activationFastBoxControlAdded = false;
circle.on('click', (e) => {
  if (!ficheControlAdded) {
    const control = new ficheControl();
    control.addTo(map);
    ficheControlAdded = true;
  }
  if (!reservationControlAdded) {
    const control = new reservationControl();
    control.addTo(map);
    reservationControlAdded = true;
  }
  if (!activationSuperBoxControlAdded) {
    const control = new activationSuperBoxControl();
    control.addTo(map);
    activationSuperBoxControlAdded = true;
  }

  if (!activationFastBoxControlAdded) {
    const control = new activationFastBoxControl();
    control.addTo(map);
    activationFastBoxControlAdded = true;
  }
});

const ficheControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-fiche");
    button.textContent = "Fiche de prospection";
    button.onclick = function () {
      
      window.location.href = "/prospection";
      //alert("Ouvrir la fiche de prospection ici");
    };
    return button;
  }
});
const reservationControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-reservation");
    button.textContent = "Réservation FWBA";
    button.onclick = function () {
      alert("Ouvrir la réservation FWBA ici");
    };
    return button;
  }
});
const activationSuperBoxControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-activation-super-box");
    button.textContent = "Activation Super Box";
    button.onclick = function () {
      alert("Activer la Super Box ici");
    };
    return button;
  }
});
const activationFastBoxControl = Leaflet.Control.extend({
  options: {
    position: 'topright',
  },
  onAdd: function (map: Leaflet.Map) {
    const button = Leaflet.DomUtil.create("button", "leaflet-control-activation-fast-box");
    button.textContent = "Activation Fast Box";
    button.onclick = function () {
      alert("Activer la Fast Box ici");
    };
    return button;
  }
});

}



}






