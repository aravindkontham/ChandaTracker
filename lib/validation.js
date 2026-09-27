export const PASSWORD_HINT =
  "At least 8 characters, with both letters and numbers.";

export function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,}$/.test(password);
}
