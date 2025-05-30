import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
*         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The category's name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was last updated
 */
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *                 description: The category's name
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
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
      const category = await prisma.category.create({
        data: {
          name: body.name,
        },
      });
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.error('POST /api/categorys error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  } 
  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Returns all categories
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: List of categories
   *         content:
   *           application/json:
   *             schema:
  */
 export async function GET() {
    try {
      const categories = await prisma.category.findMany();
      return NextResponse.json(categories);
    } catch (error) {
      console.error('GET /api/categorys error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  }