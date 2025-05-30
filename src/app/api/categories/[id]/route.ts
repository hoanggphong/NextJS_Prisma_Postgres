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
 *         name:
 *           type: string
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
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
*/
export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id: categoryId } = context.params;

      if (!categoryId) {
        return NextResponse.json(
          { error: 'Category ID is required' },
          { status: 400 }
        );
      }

      const id = parseInt(categoryId);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid category ID format' },
          { status: 400 }
        );
      }

      const body = await request.json();
  
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });
  
      if (!existingCategory) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
  
      const category = await prisma.category.update({
        where: { id },
        data: {
          name: body.name,
        },
      });
      return NextResponse.json(category);
    } catch (error) {
      console.error('PUT /api/categories/[id] error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
  /**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
  export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id: categoryId } = context.params;

      if (!categoryId) {
        return NextResponse.json(
          { error: 'Category ID is required' },
          { status: 400 }
        );
      }

      const id = parseInt(categoryId);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid category ID format' },
          { status: 400 }
        );
      }

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });
  
      if (!existingCategory) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
  
      await prisma.category.delete({
        where: { id },
      });
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error('DELETE /api/categories/[id] error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  } 