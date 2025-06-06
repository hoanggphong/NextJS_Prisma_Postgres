import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
*         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the brand
 *         name:
 *           type: string
 *           description: The brand's name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the brand was created
 *         updatedAt:
 *           type: string
 *           format: date-time
    *           description: The timestamp when the brand was last updated
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
*             properties:
 *               name:
 *                 type: string
 *                 description: The brand's name
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Invalid request body or name already exists
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      
      if (!body.name) {
        return NextResponse.json(
          { error: 'Name are required' },
          { status: 400 }
        );
      }
      const brand = await prisma.brand.create({
        data: {
          name: body.name,
        },
      });
      return NextResponse.json(brand, { status: 201 });
    } catch (error) {
      console.error('POST /api/brands error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  } 
  /**
   * @swagger
   * /api/brands:
   *   get:
   *     summary: Returns all brands
   *     tags: [Brands]
   *     responses:
   *       200:
   *         description: List of brands
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Brand'
   *       500:
   *         description: Server error
   */
  export async function GET() {
    try {
      const brands = await prisma.brand.findMany();
      return NextResponse.json(brands);
    } catch (error) {
      console.error('GET /api/brands error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  }