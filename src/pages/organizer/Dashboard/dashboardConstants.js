// src/pages/organizer/dashboard/dashboardConstants.js

export const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];
export const BAR_COLOR  = "#6366f1";
export const LINE_COLOR = "#10b981";

export const ICONS = {
  calendar:  "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  users:     "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  published: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z",
  waitlist:  "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  upcoming:  "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  cancelled: "M18 6L6 18M6 6l12 12",
};

export const METRIC_CONFIG = [
  { label: "Tổng sự kiện",    key: "total_events",     icon: "calendar",  accent: "indigo" },
  { label: "Đã xuất bản",     key: "published_events", icon: "published", accent: "green"  },
  { label: "Tổng người tham", key: "total_attendees",  icon: "users",     accent: "blue"   },
  { label: "Waitlist",        key: "waitlist_count",   icon: "waitlist",  accent: "amber"  },
  { label: "Sắp diễn ra",     key: "upcoming_events",  icon: "upcoming",  accent: "purple" },
  { label: "Đã huỷ",          key: "cancelled_events", icon: "cancelled", accent: "red"    },
];