import type {DayDTO} from "$lib/mvc/DTO/DayDTO";

export type APIResponseDTO = {
    items: DayDTO[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}
