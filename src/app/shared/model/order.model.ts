
export interface OrderItem {
    _id?: string;
    product: string;
    bundle: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
}

export interface Order {
    _id?: string;
    delivery?: string;
    subtotal: number;
    discount: number;
    grandTotal: number;
    instruction?: string;
    cut: boolean;
    status?: string;
    deliveryPrice?: number;
    deliveryAddress?: string;
    date?: Date;
    user?: {
        email?: string;
        fullName?: string;
        address?: string;
        telephoneNumber?: string;
        avatarImage?: string;
    }
    items: OrderItem[];
}

export interface TopSellingProducts {
    _id: string;
    total: number;
    quantity: number;

    product_details: {
        name: string;
        category: string;
        imagePath: string;
    }[];
}

export interface TopBuyingUsers {
    _id: string;
    total: number;
    orders: number;
    user_details: {
        email: string;
        fullName: string;
        telephoneNumber: string;
        imageUrl: string;
    }[];
}

export interface OrderStatistics {
    _id: string;
    count: number;
    total: number;
}

export interface TotalOrderCount {
    count: number;
}

export interface TotalOrderRevenue {
    total: number;
}

export interface MonthlyOrder {
    totalOrders: number;
    totalSales: number;
    month : string;
}
