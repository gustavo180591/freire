export function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
}

export function formatDateTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS'
	}).format(amount);
}

export function formatDNI(dni: string): string {
	// Formato DNI: XX.XXX.XXX
	if (dni.length <= 8) {
		return dni.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
	}
	return dni;
}

export function formatPhone(phone: string): string {
	// Formato teléfono argentino: +XX XX XXXX-XXXX
	const cleaned = phone.replace(/\D/g, '');
	
	if (cleaned.length === 10) {
		return `+54 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
	}
	
	return phone;
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isValidDNI(dni: string): boolean {
	return /^\d{7,9}$/.test(dni);
}

export function isValidPhone(phone: string): boolean {
	return /^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''));
}
