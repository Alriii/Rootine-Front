export type Category = "Work" | "Personal" | "Health";
export type TaskView = "all" | "upcoming" | "completed";
export type TaskFrequency = "DAILY" | "SPECIFIC_DAYS" | "TIMES_PER_WEEK";

export interface Task {
	id: string;
	title: string;
	category: Category;
	time: string;
	date: string;
	completed: boolean;
	priority: boolean | "Low" | "Medium" | "High";
	detail?: string;
	notes?: string;
	completedAt?: string;

	// Backend sync properties
	frequency?: TaskFrequency;
	reminderEnabled?: boolean;
	reminderTime?: string | null;
	reminderIntervalHours?: number;
	maxDailyReminders?: number;
}

export type DashboardIconName =
	| "search"
	| "user"
	| "list"
	| "check"
	| "alert"
	| "calendar"
	| "chevron-left"
	| "chevron-right"
	| "more"
	| "bolt"
	| "close"
	| "settings"
	| "logout";
