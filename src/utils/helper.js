export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmed);
};

// src/utils/number.ts (or number.js)
export const addThousandsSeparator = (num) => {
  const n = Number(num ?? 0);
  return n.toLocaleString("en-IN"); // Use "en-US" if you prefer US formatting
};

