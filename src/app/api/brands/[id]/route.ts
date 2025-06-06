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
 *         name:
 *           type: string
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
 * /api/brands/{id}:
 *   put:
 *     summary: Update a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'   
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Server error
 */
export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id: brandId } = context.params;

      if (!brandId) {
        return NextResponse.json(
          { error: 'Brand ID is required' },
          { status: 400 }
        );
      }

      const id = parseInt(brandId);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid brand ID format' },
          { status: 400 }
        );
      }

      const body = await request.json();
  
      // Check if brand exists
      const existingBrand = await prisma.brand.findUnique({
        where: { id },
      });
  
      if (!existingBrand) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        );
      }
  
      const brand = await prisma.brand.update({
        where: { id },
        data: {
          name: body.name,
        },
      });
      return NextResponse.json(brand);
    } catch (error) {
      console.error('PUT /api/brands/[id] error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
    /**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The brand ID
 *     responses:
 *       204:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Server error
 */
    export async function DELETE(
        request: NextRequest,
        context: { params: { id: string } }
      ) {
        try {
          const { id: brandId } = context.params;
    
          if (!brandId) {
            return NextResponse.json(
              { error: 'Brand ID is required' },
              { status: 400 }
            );
          }
    
          const id = parseInt(brandId);
          
          if (isNaN(id)) {
            return NextResponse.json(
              { error: 'Invalid brand ID format' },
              { status: 400 }
            );
          }
    
          // Check if brand exists
          const existingBrand = await prisma.brand.findUnique({
            where: { id },
          });
      
          if (!existingBrand) {
            return NextResponse.json(
              { error: 'Brand not found' },
              { status: 404 }
            );
          }
      
          await prisma.brand.delete({
            where: { id },
          });
          return new NextResponse(null, { status: 204 });
        } catch (error) {
          console.error('DELETE /api/brands/[id] error:', error);
          return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
          );
        }
      } 