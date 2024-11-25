import {Category} from "./category.model";

export interface Delivery {
    id: string;
    name: string;
    description: string;
    price: number;
    enabled: boolean;
    createdOn: Date;
    createdBy: string;
}

export interface Deliveries {
    zones: Delivery[];
    current: number;
    current_size: number;
    pages: number;
    count: number;
    size: number;
}
