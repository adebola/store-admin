import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TotalUserCount} from "../model/user.model";
import {environment} from "../../../environments/environment";
import {BackEndUser, BackEndUserPage} from "../../authentication/user.model";

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

    getUsers(page: number = 1, size: number = 20,): Observable<BackEndUserPage> {
        const params: { size: number; page: number;} =  {size, page};
        return this.http.get<BackEndUserPage>(`${USER_URL}/admin`, {
            params
        });
    }

    getUserById(id: string): Observable<BackEndUser> {
        return this.http.get<BackEndUser>(`${USER_URL}/admin/${id}`);
    }

    search(page: number = 1, size: number = 20, searchString: string): Observable<BackEndUserPage> {
        const params: { size: number; page: number; searchString: string;} =  {size, page, searchString};
        return this.http.get<BackEndUserPage>(`${USER_URL}/admin/search`, {
           params
        });
    }
}
