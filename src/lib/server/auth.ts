import { hash, compare } from 'bcrypt';
import { SignJWT, verifyJWT } from 'jose';
import { nanoid } from 'nanoid';
import type { User } from '@prisma/client';
import { prisma } from './prisma';
import { databaseUrl, jwtSecret, jwtRefreshSecret, jwtExpiration, jwtRefreshExpiration } from '$lib/server/private/env';

// Tipos para tokens
export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Servicio de hashing de contraseñas
export class PasswordService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    // Validación de caracteres especiales
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Servicio de tokens JWT
export class TokenService {
  private static getSecretKey(): Uint8Array {
    return new TextEncoder().encode(jwtSecret);
  }

  private static getRefreshSecretKey(): Uint8Array {
    return new TextEncoder().encode(jwtRefreshSecret);
  }

  static async generateAccessToken(user: AuthUser): Promise<string> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + jwtExpiration
    };

    const secret = new TextEncoder().encode(jwtSecret);
    return await new SignJWT(payload, secret)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + jwtExpiration * 1000))
      .sign();
  }

  static async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + jwtRefreshExpiration
    };

    const secret = new TextEncoder().encode(jwtRefreshSecret);
    return await new SignJWT(payload, secret)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + jwtRefreshExpiration * 1000))
      .sign();
  }

  static async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const secret = this.getSecretKey();
      const { payload } = await jwtVerify(token, secret);
      return payload as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
    try {
      const secret = this.getRefreshSecretKey();
      const { payload } = await jwtVerify(token, secret);
      return payload as { sub: string };
    } catch (error) {
      return null;
    }
  }
}

// Servicio de autenticación principal
export class AuthService {
  static async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Buscar usuario en la base de datos
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          role: true
        }
      });

      if (!user) {
        return { success: false, error: 'Usuario o contraseña incorrectos' };
      }

      if (!user.isActive) {
        return { success: false, error: 'Usuario desactivado' };
      }

      // Verificar contraseña
      const isPasswordValid = await PasswordService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Usuario o contraseña incorrectos' };
      }

      // Generar tokens
      const [accessToken, refreshToken] = await Promise.all([
        TokenService.generateAccessToken({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }),
        TokenService.generateRefreshToken(user.id)
      ]);

      // Guardar refresh token en la base de datos
      await prisma.refreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + jwtRefreshExpiration * 1000)
      });

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };

      return { success: true, user: authUser };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<LoginResult> {
    try {
      // Validar fortaleza de la contraseña
      const passwordValidation = PasswordService.validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        return { 
          success: false, 
          error: `Contraseña inválida: ${passwordValidation.errors.join(', ')}` 
        };
      }

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        return { success: false, error: 'El email ya está registrado' };
      }

      // Hashear contraseña
      const hashedPassword = await PasswordService.hashPassword(userData.password);

      // Crear nuevo usuario
      const newUser = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase().trim(),
          password: hashedPassword,
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
          role: userData.role || 'ALUMNO'
        }
      });

      // Generar tokens para el nuevo usuario
      const [accessToken, refreshToken] = await Promise.all([
        TokenService.generateAccessToken({
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }),
        TokenService.generateRefreshToken(newUser.id)
      ]);

      // Guardar refresh token
      await prisma.refreshToken.create({
        token: refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + jwtRefreshExpiration * 1000)
      });

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      };

      return { success: true, user: authUser };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  static async refreshToken(refreshTokenString: string): Promise<{ accessToken: string } | null> {
    try {
      // Verificar refresh token
      const payload = await TokenService.verifyRefreshToken(refreshTokenString);
      if (!payload) {
        return null;
      }

      // Buscar refresh token en la base de datos
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshTokenString }
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        return null;
      }

      // Buscar usuario
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true }
      });

      if (!user || !user.isActive) {
        return null;
      }

      // Generar nuevo access token
      const accessToken = await TokenService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      });

      // Invalidar refresh token usado
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });

      return { accessToken };
    } catch (error) {
      console.error('Error en refresh token:', error);
      return null;
    }
  }

  static async logout(refreshTokenString: string): Promise<boolean> {
    try {
      // Invalidar refresh token
      await prisma.refreshToken.deleteMany({
        where: { 
          token: refreshTokenString,
          OR: [
            { expiresAt: { lt: new Date() } }
          ]
        }
      });

      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  }

  static async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
      });

      if (!user || !user.isActive) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }
}
