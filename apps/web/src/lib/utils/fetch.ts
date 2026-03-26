export interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
	status: number;
}

export async function apiFetch<T = any>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		const data = await response.json();

		return {
			data,
			status: response.status
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Error desconocido',
			status: 500
		};
	}
}

export async function apiPost<T = any>(
	url: string,
	body: any
): Promise<ApiResponse<T>> {
	return apiFetch<T>(url, {
		method: 'POST',
		body: JSON.stringify(body)
	});
}

export async function apiGet<T = any>(
	url: string
): Promise<ApiResponse<T>> {
	return apiFetch<T>(url, {
		method: 'GET'
	});
}

export async function apiPut<T = any>(
	url: string,
	body: any
): Promise<ApiResponse<T>> {
	return apiFetch<T>(url, {
		method: 'PUT',
		body: JSON.stringify(body)
	});
}

export async function apiDelete<T = any>(
	url: string
): Promise<ApiResponse<T>> {
	return apiFetch<T>(url, {
		method: 'DELETE'
	});
}
