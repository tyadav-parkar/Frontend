export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmed);
};
