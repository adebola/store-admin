import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Categories, Category} from "../model/category.model";
import {environment} from "../../../environments/environment";

const CATEGORY_URL = environment.base_url + '/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient) {}

    getCategories(page: number = 1, size: number = 20, sort = 'ascending'): Observable<Categories> {
        const params: { size: number; page: number;} =  {size, page};

        return this.http.get<Categories>(`${CATEGORY_URL}/admin`, {
            params
        });
    }

    searchCategories(page: number = 1, size: number = 20, search: string): Observable<Categories> {
        const params: { size: number; search: string; page: number;} =  {size, search, page};

        return this.http.get<Categories>(`${CATEGORY_URL}/search`, {
            params
        });
    }

    getCategoryById(id: string): Observable<Category> {
        return this.http.get<{category: Category}>(`${CATEGORY_URL}/${id}`).pipe(
            map(c => c.category)
        );
    }

    createCategory(category: {name: string, description: string}, file: File): Observable<Category> {
        const data: FormData = new FormData();

        data.append('file', file);
        data.append('category', JSON.stringify(category));

        return this.http.post<Category>(`${CATEGORY_URL}`, data);
    }

    updateCategory(category: {name: string, description: string}, file: File | null, id: string): Observable<Category> {
        const data: FormData = new FormData();

        if (file) {
            data.append('file', file);
        }

        data.append('category', JSON.stringify(category));

        return this.http.put<Category>(`${CATEGORY_URL}/${id}`, data);
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete(`${CATEGORY_URL}/${id}`);
    }
}
