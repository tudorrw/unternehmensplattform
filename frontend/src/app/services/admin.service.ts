import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'https://example.com/api/admins'; // Înlocuiește cu URL-ul real al API-ului tău

    constructor(private http: HttpClient) {}

    // Obține lista de admini din baza de date
    getAdmins(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // Trimite un admin nou în baza de date
    createAdmin(adminData: { name: string; email: string; telefonNumber: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, adminData);
    }
}
