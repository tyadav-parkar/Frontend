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

// src/utils/number.js
// export const addThousandsSeparator = (num) => {
//   if (num === null || num === undefined || Number.isNaN(Number(num))) return "";
  
//   const str = String(num);
//   const [integerPartRaw, fractionalPart] = str.split(".");
//   // Remove any non-digits except minus sign
//   const integerPart = integerPartRaw.replace(/[^0-9-]/g, "");

//   // Handle negative numbers
//   const isNegative = integerPart.startsWith("-");
//   const digits = isNegative ? integerPart.slice(1) : integerPart;

//   // Insert commas every 3 digits from the right (US-style)
//   const formattedInteger = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   const withSign = isNegative ? `-${formattedInteger}` : formattedInteger;

//   return fractionalPart !== undefined && fractionalPart !== ""
//     ? `${withSign}.${fractionalPart}`
//     : withSign;
// };
