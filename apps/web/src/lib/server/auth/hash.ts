import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export function validatePassword(password: string): boolean {
	return password.length >= 8;
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validateDNI(dni: string): boolean {
	return /^\d{7,9}$/.test(dni);
}
