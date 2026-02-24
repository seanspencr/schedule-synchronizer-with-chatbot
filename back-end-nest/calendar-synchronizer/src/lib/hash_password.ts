import * as bcrypt from 'bcrypt';

export async function hash_password(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    console.log("Hashed password:", hashed);
    return hashed;
}

export async function check_password(plain_password: string, hashed_password: string): Promise<boolean> {
    return bcrypt.compare(plain_password, hashed_password);
}