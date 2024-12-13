import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  constructor(private platform: Platform, private zone: NgZone) {}

  // Variables de estado
  carrito: any[] = [];
  viaje: any[] = [];
  input = "";
  autocompleteItems: any[] = [];
  distancia = "";
  duracion = "";

  @ViewChild('map') mapElement: ElementRef | undefined;
  public map: any;
  public start: any = "Serrano 1105, Melipilla, Chile";
  public end: any = "Pomaire, Melipilla, Chile";
  public directionsService: any;
  public directionsDisplay: any;

  ngOnInit() {
    this.loadLocalStorageData();
    // Cargar el script de Google Maps de manera asincrónica
    this.loadGoogleMapsScript().then(() => {
      this.platform.ready().then(() => {
        this.initMap();
      });
    }).catch(err => {
      console.error('Error loading Google Maps script:', err);
    });
  }
  loadLocalStorageData() {
    const viajeData = localStorage.getItem("viaje");

    if (viajeData) {
      this.viaje = JSON.parse(viajeData);
      console.log(this.viaje);
    } else {
      this.viaje = []; // Inicializa como vacío si no hay datos
      console.log('No hay datos de viaje en localStorage.');
    }

  }

  loadGoogleMapsScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve(google);
      } else {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAzk949d0XkOUKLid2THsCUrFbwGyOdry0';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(google);
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
      }
    });
  }

  initMap() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    const mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(37.7749, -122.4194), // Coordenadas de ejemplo
      zoomControl: true,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement!.nativeElement, mapOptions);
    
    const infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Estás aquí");
          infoWindow.open(this.map);
          this.map.setCenter(pos);
        },
        () => {
          alert("No se pudo obtener la ubicación");
        }
      );
    }
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING',
    }, (response: any, status: string) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        const route = response.routes[0];
        const leg = route.legs[0];

        const distanceInKilometers = (leg.distance.value / 1000).toFixed(2);
        console.log(`Distancia: ${distanceInKilometers} km`);
        this.distancia = `${distanceInKilometers} km`;

        const durationInSeconds = leg.duration.value;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log(`Duración: ${formattedDuration} (mm:ss)`);
        this.duracion = `${formattedDuration}`;

        console.log(`Inicio: ${leg.start_address}`);
        console.log(`Destino: ${leg.end_address}`);

        if (leg.duration_in_traffic) {
          const durationInTraffic = leg.duration_in_traffic.value / 60;
          console.log(`Tiempo de viaje en tráfico: ${durationInTraffic} minutos`);
        }

        leg.steps.forEach((step: any, index: number) => {
          const stepDistance = step.distance.value / 1000;
          const stepDuration = step.duration.value / 60;
          console.log(`Paso ${index + 1}: ${step.instructions}, Distancia: ${stepDistance} km, Tiempo: ${stepDuration} minutos`);
        });
      } else {
        window.alert('La solicitud de direcciones falló debido a ' + status);
      }
    });
  }

  updateSearchResults() {
    let GoogleAutocomplete = new google.maps.places.AutocompleteService();

    if (this.end == '') {
      this.autocompleteItems = [];
      return;
    }

    GoogleAutocomplete.getPlacePredictions({ input: this.end }, (predictions: any, status: any) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction: any) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  selectSearchResult(item: any) {
    this.end = item.description;
    this.autocompleteItems = [];
    this.initMap(); // Re-inicializamos el mapa con la nueva dirección de destino
  }
}