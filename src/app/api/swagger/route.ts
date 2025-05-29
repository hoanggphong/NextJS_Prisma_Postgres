import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

const spec = createSwaggerSpec({
  apiFolder: 'src/app/api',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js Prisma API Documentation',
      version: '1.0.0',
    },
  },
});

export async function GET() {
  return NextResponse.json(spec);
} 