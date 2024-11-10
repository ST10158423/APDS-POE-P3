import argon2 from 'argon2';

const hashedPassword = '$2b$12$PfuZahk2OtU9Gc5trh/WzuXobfCiOprrAu5KwkV5j8ncx9mjhC7fG';  // Replace with the manually generated hash
const plaintextPassword = 'Password123!';  // Use the same password

async function verifyPassword() {
  const isMatch = await argon2.verify(hashedPassword, plaintextPassword);
  console.log('Password match:', isMatch);
}

verifyPassword();