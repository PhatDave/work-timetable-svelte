export type APIResponse = {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: APIResponseItem[];
}
export type APIResponseItem = {
    collectionId: string;
    collectionName: string;
    day: string;
    day_id: string;
    hours: number;
    description?: string;
    id: string;
    user_name: string;
}
