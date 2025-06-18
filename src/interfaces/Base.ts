export interface ResponseContainer<T> {
	status: 'success' | 'error';
	message?: string;
	code?: number;
	data?: T;
}