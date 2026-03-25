import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return json(users);
}