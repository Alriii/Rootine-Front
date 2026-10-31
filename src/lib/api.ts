// frontend/src/lib/api.ts
import { useEffect, useState } from "react";

function getApiBaseUrl(): string {
	const raw = (
		import.meta.env.VITE_API_URL ||
		import.meta.env.VITE_API_BASE_URL ||
		"http://localhost:7000/api/v1"
	).trim().replace(/\/+$/, "");

	if (raw.endsWith("/api/v1")) return raw;
	if (raw.endsWith("/api")) return `${raw}/v1`;
	return `${raw}/api/v1`;
}

const API_BASE_URL = getApiBaseUrl();

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

		const data = await response.json().catch(() => ({}));

		if (!response.ok) {
			throw new Error(
				(data as { message?: string }).message || `Server returned error (${response.status})`
			);
		}

		return data as T;
	} catch (err) {
		if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
			throw new Error(
				"Unable to reach the server. If your Render backend is waking up from sleep, please wait 30 seconds and retry."
			);
		}
		throw err;
	} finally {
		activeRequestsCount = Math.max(0, activeRequestsCount - 1);
		notify();
	}
}
