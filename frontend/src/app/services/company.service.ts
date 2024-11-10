// company.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = 'https://your-api-url.com/companies'; // Înlocuiește cu URL-ul corect al API-ului

    constructor(private http: HttpClient) {}

    // Funcția pentru a obține lista de companii
    getCompanies(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}
