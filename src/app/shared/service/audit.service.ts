import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Audit, Audits} from "../model/audit.model";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

const AUDIT_URL = environment.base_url + '/audit';

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    constructor(private http: HttpClient) {}

    getAudits(page: number = 1, size: number = 20): Observable<Audits> {
        const params: { size: number; page: number;} =  {size, page};

        return this.http.get<Audits>(`${AUDIT_URL}`, {
            params
        });
    }

    getAuditById(id: string): Observable<Audit> {
        return this.http.get<{audit: Audit}>(`${AUDIT_URL}/${id}`)
            .pipe(map(a => a.audit));
    }

    searchAudits(page: number = 1, size: number = 20, search: string): Observable<Audits> {
        const params: { size: number; search: string; page: number;} =  {size, search, page};

        return this.http.get<Audits>(`${AUDIT_URL}/search`, {
            params
        });
    }
}
