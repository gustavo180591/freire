import { test, expect } from '@playwright/test';

test.describe('Formulario de Registro', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/register');
	});

	test('debería mostrar todos los campos del formulario', async ({ page }) => {
		// Verificar que los campos obligatorios están presentes
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
		await expect(page.locator('input[name="firstName"]')).toBeVisible();
		await expect(page.locator('input[name="lastName"]')).toBeVisible();
		await expect(page.locator('input[name="dni"]')).toBeVisible();
		
		// Verificar campos opcionales
		await expect(page.locator('input[name="phone"]')).toBeVisible();
		await expect(page.locator('input[name="birthDate"]')).toBeVisible();
		
		// Verificar etiquetas
		await expect(page.locator('label[for="email"]')).toContainText('Email');
		await expect(page.locator('label[for="password"]')).toContainText('Contraseña');
		await expect(page.locator('label[for="confirmPassword"]')).toContainText('Confirmar Contraseña');
		await expect(page.locator('label[for="firstName"]')).toContainText('Nombre');
		await expect(page.locator('label[for="lastName"]')).toContainText('Apellido');
		await expect(page.locator('label[for="dni"]')).toContainText('DNI *');
		await expect(page.locator('label[for="phone"]')).toContainText('Teléfono');
		await expect(page.locator('label[for="birthDate"]')).toContainText('Fecha de Nacimiento');
	});

	test('debería mostrar errores de validación para campos obligatorios vacíos', async ({ page }) => {
		// Intentar enviar formulario vacío
		await page.click('button[type="submit"]');
		
		// Verificar mensajes de error
		await expect(page.locator('text=El email es requerido')).toBeVisible();
		await expect(page.locator('text=La contraseña es requerida')).toBeVisible();
		await expect(page.locator('text=El nombre es requerido')).toBeVisible();
		await expect(page.locator('text=El apellido es requerido')).toBeVisible();
		await expect(page.locator('text=El DNI es requerido')).toBeVisible();
	});

	test('debería mostrar error para email inválido', async ({ page }) => {
		await page.fill('input[name="email"]', 'email-invalido');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		
		await page.click('button[type="submit"]');
		
		await expect(page.locator('text=El email no es válido')).toBeVisible();
	});

	test('debería mostrar error para contraseña demasiado corta', async ({ page }) => {
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', '123');
		await page.fill('input[name="confirmPassword"]', '123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		
		await page.click('button[type="submit"]');
		
		await expect(page.locator('text=La contraseña debe tener al menos 8 caracteres')).toBeVisible();
	});

	test('debería mostrar error para DNI inválido', async ({ page }) => {
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '123');
		
		await page.click('button[type="submit"]');
		
		await expect(page.locator('text=El DNI debe tener entre 7 y 9 dígitos')).toBeVisible();
	});

	test('debería mostrar error si las contraseñas no coinciden', async ({ page }) => {
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password456');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		
		await page.click('button[type="submit"]');
		
		await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
	});

	test('debería mostrar error para teléfono inválido', async ({ page }) => {
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		await page.fill('input[name="phone"]', 'abc');
		
		await page.click('button[type="submit"]');
		
		await expect(page.locator('text=El teléfono no es válido')).toBeVisible();
	});

	test('debería mostrar error para menor de edad', async ({ page }) => {
		const today = new Date();
		const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
		const dateStr = underageDate.toISOString().split('T')[0];
		
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		await page.fill('input[name="birthDate"]', dateStr);
		
		await page.click('button[type="submit"]');
		
		await expect(page.locator('text=Debes ser mayor de 18 años')).toBeVisible();
	});

	test('debería permitir formulario válido con campos obligatorios', async ({ page }) => {
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		
		// No debería haber errores de validación
		await expect(page.locator('text=El email es requerido')).not.toBeVisible();
		await expect(page.locator('text=La contraseña es requerida')).not.toBeVisible();
		await expect(page.locator('text=El nombre es requerido')).not.toBeVisible();
		await expect(page.locator('text=El apellido es requerido')).not.toBeVisible();
		await expect(page.locator('text=El DNI es requerido')).not.toBeVisible();
	});

	test('debería permitir formulario válido con todos los campos', async ({ page }) => {
		const today = new Date();
		const adultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
		const dateStr = adultDate.toISOString().split('T')[0];
		
		await page.fill('input[name="email"]', 'test@test.com');
		await page.fill('input[name="password"]', 'password123');
		await page.fill('input[name="confirmPassword"]', 'password123');
		await page.fill('input[name="firstName"]', 'Juan');
		await page.fill('input[name="lastName"]', 'Pérez');
		await page.fill('input[name="dni"]', '12345678');
		await page.fill('input[name="phone"]', '+5491112345678');
		await page.fill('input[name="birthDate"]', dateStr);
		
		// No debería haber errores
		await expect(page.locator('text=El email no es válido')).not.toBeVisible();
		await expect(page.locator('text=La contraseña debe tener al menos 8 caracteres')).not.toBeVisible();
		await expect(page.locator('text=Las contraseñas no coinciden')).not.toBeVisible();
		await expect(page.locator('text=El DNI debe tener entre 7 y 9 dígitos')).not.toBeVisible();
		await expect(page.locator('text=El teléfono no es válido')).not.toBeVisible();
		await expect(page.locator('text=Debes ser mayor de 18 años')).not.toBeVisible();
	});

	test('debería mostrar/ocultar contraseña al hacer clic en el ojo', async ({ page }) => {
		const passwordInput = page.locator('input[name="password"]');
		const toggleButton = page.locator('div.mt-1.relative button[type="button"]').first();
		
		await page.fill('input[name="password"]', 'password123');
		
		// Por defecto debería estar oculta
		await expect(passwordInput).toHaveAttribute('type', 'password');
		
		// Al hacer clic debería mostrarse
		await toggleButton.click();
		await expect(passwordInput).toHaveAttribute('type', 'text');
		
		// Al hacer clic nuevamente debería ocultarse
		await toggleButton.click();
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});

	test('debería mostrar/ocultar confirmar contraseña al hacer clic en el ojo', async ({ page }) => {
		const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
		const toggleButton = page.locator('div.mt-1.relative button[type="button"]').nth(1);
		
		await page.fill('input[name="confirmPassword"]', 'password123');
		
		// Por defecto debería estar oculta
		await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
		
		// Al hacer clic debería mostrarse
		await toggleButton.click();
		await expect(confirmPasswordInput).toHaveAttribute('type', 'text');
		
		// Al hacer clic nuevamente debería ocultarse
		await toggleButton.click();
		await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
	});
});
