import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
import {ConsultationDisplay,} from '../models/consulation.model'

@Injectable({ providedIn: 'root' })
export class ConsultationService {
	private apiUrl = `${environment.apiUrl}/consultation`

	constructor(private http: HttpClient) {}

	// Modify submit to accept FormData instead of ConsultationRequest
	submit(payload: FormData): Observable<any> {
		// When sending FormData, HttpClient automatically sets the Content-Type to multipart/form-data
		return this.http.post(this.apiUrl, payload)
	}

	getAll(): Observable<ConsultationDisplay[]> {
		return this.http.get<ConsultationDisplay[]>(this.apiUrl)
	}
}
