export const statusEnums = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const statusEnumsList = Object.values(statusEnums) as readonly string[];
