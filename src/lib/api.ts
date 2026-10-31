// frontend/src/lib/api.ts
import { useEffect, useState } from "react";

const API_BASE_URL =
	import.meta.env.VITE_API_URL ||
	import.meta.env.VITE_API_BASE_URL ||
	"http://localhost:7000/api/v1";

type LoadingListener = (count: number) => void;
const listeners = new Set<LoadingListener>();
let activeRequestsCount = 0;

function notify() {
	listeners.forEach((fn) => fn(activeRequestsCount));
}

export function useApiLoading() {
	const [isLoading, setIsLoading] = useState(activeRequestsCount > 0);

	useEffect(() => {
		const listener: LoadingListener = (count) => {
			setIsLoading(count > 0);
		};
		listeners.add(listener);
		setIsLoading(activeRequestsCount > 0);
		return () => {
			listeners.delete(listener);
		};
	}, []);

	return isLoading;
}

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = localStorage.getItem("rootine_access_token");

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...options.headers,
	};

	activeRequestsCount++;
	notify();

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "An unexpected error occurred");
		}

		return data;
	} finally {
		activeRequestsCount = Math.max(0, activeRequestsCount - 1);
		notify();
	}
}
