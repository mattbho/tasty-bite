import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

export const passwordsMatch = async (
  hash: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(hash, password);
};
