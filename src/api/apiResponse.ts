export interface ApiResponse<T = any> {
    status: number,
    message: string,
    info?: T
}