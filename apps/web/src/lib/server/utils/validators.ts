export interface ValidationRule {
	field: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: any) => string | null;
}

export interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

export class Validator {
	private rules: ValidationRule[] = [];

	addRule(rule: ValidationRule): this {
		this.rules.push(rule);
		return this;
	}

	validate(data: Record<string, any>): ValidationResult {
		const errors: Record<string, string> = {};

		for (const rule of this.rules) {
			const value = data[rule.field];

			// Validación requerido
			if (rule.required && (!value || value === '')) {
				errors[rule.field] = `El campo ${rule.field} es requerido`;
				continue;
			}

			// Si no es requerido y está vacío, omitir otras validaciones
			if (!rule.required && (!value || value === '')) {
				continue;
			}

			// Validación longitud mínima
			if (rule.minLength && value.length < rule.minLength) {
				errors[rule.field] = `El campo ${rule.field} debe tener al menos ${rule.minLength} caracteres`;
			}

			// Validación longitud máxima
			if (rule.maxLength && value.length > rule.maxLength) {
				errors[rule.field] = `El campo ${rule.field} no debe exceder ${rule.maxLength} caracteres`;
			}

			// Validación patrón
			if (rule.pattern && !rule.pattern.test(value)) {
				errors[rule.field] = `El campo ${rule.field} tiene un formato inválido`;
			}

			// Validación personalizada
			if (rule.custom) {
				const customError = rule.custom(value);
				if (customError) {
					errors[rule.field] = customError;
				}
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	}
}

// Validadores predefinidos
export const emailValidator = new Validator()
	.addRule({
		field: 'email',
		required: true,
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	});

export const passwordValidator = new Validator()
	.addRule({
		field: 'password',
		required: true,
		minLength: 8
	});

export const dniValidator = new Validator()
	.addRule({
		field: 'dni',
		required: true,
		pattern: /^\d{7,9}$/
	});

export const nameValidator = new Validator()
	.addRule({
		field: 'firstName',
		required: true,
		minLength: 2,
		maxLength: 100
	})
	.addRule({
		field: 'lastName',
		required: true,
		minLength: 2,
		maxLength: 100
	});
