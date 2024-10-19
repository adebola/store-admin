import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TotalUserCount} from "../model/user.model";
import {environment} from "../../../environments/environment";
import {BackEndUser} from "../../authentication/user.model";

const USER_URL = environment.base_url + '/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    getUserCount(): Observable<TotalUserCount> {
        return this.http.get<TotalUserCount>(`${USER_URL}/admin/count`);

    }

    getUserMonthlyCount(): Observable<TotalUserCount> {
        return this.http.get<TotalUserCount>(`${USER_URL}/admin/countmonth`);

    }

    getUsersJoinedToday(): Observable<{result: BackEndUser[]}> {
        return this.http.get<{result: BackEndUser[]}>(`${USER_URL}/admin/joinedtoday`);
    }
}
