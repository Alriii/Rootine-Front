import type { Task } from "@/components/shared/types";

export const initialTasks: Task[] = [
	{
		id: "morning-workout",
		title: "Morning Workout Routine",
		category: "Health",
		time: "06:00 AM",
		date: "2026-10-26",
		completed: true,
		priority: false,
	},
	{
		id: "team-planning",
		title: "Quarterly Team Planning Call",
		category: "Work",
		time: "10:30 AM",
		date: "2026-10-26",
		completed: false,
		priority: true,
	},
	{
		id: "grocery-list",
		title: "Review Weekly Grocery List",
		category: "Personal",
		time: "05:00 PM",
		date: "2026-10-26",
		completed: false,
		priority: false,
		detail: "Emails",
	},
];
