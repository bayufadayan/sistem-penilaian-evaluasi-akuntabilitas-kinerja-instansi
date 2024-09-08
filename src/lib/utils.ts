import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 8);
  
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
