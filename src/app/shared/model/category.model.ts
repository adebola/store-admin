export interface Category {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    enabled: boolean;
    createdOn: Date;
    createdBy: string;
}

export interface Categories {
    categories: Category[];
    current: number;
    current_size: number;
    pages: number;
    count: number;
    size: number;
}
