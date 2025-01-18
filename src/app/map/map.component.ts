import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  countries: any[] = []; 
  country: any = null; 
  isLoading: boolean = true; 

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {

    this.countryService.getCountryData().subscribe({
      next: (data: any) => {
        console.log('API Response:', data); 
  
       
        this.countries = data[1].filter((country: any) => country.iso2Code);
  
        console.log('Filtered Countries:', this.countries);
        console.log('ISO2 Country Codes:', this.countries.map((c) => c.iso2Code)); 
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching country data:', err);
        this.isLoading = false;
      },
    });
  }


  fetchCountryDetails(countryCode: string): void {
    this.countryService.getCountryDetails(countryCode).subscribe({
      next: (data: any) => {
        const countryDetails = data[1][0]; 
        this.country = {
          place: countryDetails.name,
          capitalCity: countryDetails.capitalCity || 'N/A',
          region: countryDetails.region.value || 'N/A',
          incomeLevel: countryDetails.incomeLevel.value || 'N/A',
          population: countryDetails.population || 'N/A',
          latitude: countryDetails.latitude || 'N/A',
          longitude: countryDetails.longitude || 'N/A',
        };
        console.log('Fetched Country Details:', this.country);
      },
      error: (err: any) => {
        console.error('Error fetching country details:', err);
      },
    });
  }


  setCountryData(event: any): void {
    const countryCode = event?.target?.id?.toUpperCase();
    console.log('Normalized SVG Country Code:', countryCode);

    if (countryCode) {
      this.fetchCountryDetails(countryCode); 
    } else {
      console.error('Invalid country code or event data:', event);
    }
  }
}
