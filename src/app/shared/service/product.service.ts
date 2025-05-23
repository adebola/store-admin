import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Bundle, Product, Products} from "../model/product.model";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {ProductOrderStatistics} from "../model/order.model";

const PRODUCT_URL = environment.base_url + '/product';
const ORDER_URL = environment.base_url + '/order';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(
        private http: HttpClient,
    ) {}

    getProducts(page: number = 1, size: number = 20, sort = 'ascending'): Observable<Products> {
        const params: { size: number; page: number;} =  {size, page};

        return this.http.get<Products>(`${PRODUCT_URL}/admin/all`, {
            params
        });
    }

    searchProducts(page: number = 1, size: number = 20, search: string): Observable<Products> {
        const params: { size: number; search: string; page: number;} =  {size, search, page};

        return this.http.get<Products>(`${PRODUCT_URL}/admin/search`, {
            params
        });
    }

    public getProductById(id: string): Observable<Product> {
        return this.http.get<{product: Product}>(`${PRODUCT_URL}/${id}`).pipe(
            map(p => p.product)
        );
    }

    getProductOrderStatistics(id: string): Observable<ProductOrderStatistics> {
        return this.http.get<ProductOrderStatistics>(`${ORDER_URL}/admin/product/${id}`);
    }

    suspendProductBundle (bundleId: string,  productId: string): Observable<any> {
        return this.http.put(`${PRODUCT_URL}/bundle/suspend`, {
            bundleId,
            productId
        });
    }

    restoreProductBundle (bundleId: string,  productId: string): Observable<any> {
        return this.http.put(`${PRODUCT_URL}/bundle/restore`, {
            bundleId,
            productId
        });
    }

    createBundle(bundle: Partial<Bundle>,  productId: string): Observable<any> {
        return this.http.post(`${PRODUCT_URL}/bundle`, {
            id: productId,
            bundle: {
                unit: bundle.unit,
                price: bundle.price,
            }
        });
    }

    updateBundle(bundle: Partial<Bundle>,  productId: string): Observable<any> {
        return this.http.put(`${PRODUCT_URL}/bundle`, {
            id: productId,
            bundle: {
                _id: bundle._id,
                unit: bundle.unit,
                price: bundle.price,
            }
        });
    }

    removeBundle(bundleId: string,  productId: string): Observable<any> {
        return this.http.delete(`${PRODUCT_URL}/bundle`, {
            params: {
                productId,
                bundleId
            }
        });
    }

    getCategories(): Observable<string[]> {
        return this.http.get<{categories: string[]}>(`${PRODUCT_URL}/categories`)
            .pipe(map(c => c.categories));
    }

    updateProduct(id: string,  product: Partial<Product>, file: File | null): Observable<any> {
        const data: FormData = new FormData();
        if (file) data.append('file', file);
        data.append('product', JSON.stringify(product));

        return this.http.put(`${PRODUCT_URL}/admin/update/${id}`, data);
    }

    createProduct(product: {
        name: string,
        category: string,
        description: string,
        bundles : {unit: string,  price: number}[]
    }, file: File): Observable<any> {
        const data: FormData = new FormData();
        data.append('file', file);
        data.append('product', JSON.stringify(product));

        return this.http.post(`${PRODUCT_URL}/admin/create`, data);
    }
}
