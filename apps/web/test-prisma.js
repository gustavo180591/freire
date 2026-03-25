import { prisma } from './src/lib/server/prisma.ts';

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users:', users);
    
    // Crear un usuario de prueba
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
      },
    });
    console.log('New user:', newUser);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

test();
