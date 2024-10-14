
export interface ApiError  extends Error {
	message: string;
	cause: string;
}

export function isApiError(x: unknown): x is ApiError {
	if (x && typeof x === 'object' && 'name' in x) {return true;}
	return false;
}
