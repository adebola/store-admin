export interface Audit {
    id: string;
    action: string;
    date: Date;
    user: string;
    description: string;
}

export interface Audits {
    audits: Audit[];
    current: number;
    current_size: number;
    pages: number;
    count: number;
    size: number;
}
