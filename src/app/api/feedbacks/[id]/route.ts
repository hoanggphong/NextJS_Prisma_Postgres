import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/feedbacks/{id}:
 *   put:
 *     summary: Update a feedback by ID
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The feedback content
 *               rating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: The rating (0-5 stars)
 *               authorId:
 *                 type: integer
 *                 description: The ID of the user writing the feedback
 *               productId:
 *                 type: integer
 *                 description: The ID of the product being reviewed
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Feedback, User, or Product not found
 *       500:
 *         description: Server error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Validate rating if provided
    if (typeof body.rating === 'number' && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      );
    }

    // Check if user and product exist if IDs are provided
    if (body.authorId) {
      const user = await prisma.user.findUnique({ where: { id: body.authorId } });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    if (body.productId) {
      const product = await prisma.product.findUnique({ where: { id: body.productId } });
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: {
        content: body.content,
        rating: body.rating,
        authorId: body.authorId,
        productId: body.productId,
      },
      include: {
        author: true,
        product: true,
      },
    });
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('PUT /api/feedbacks/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/feedbacks/{id}:
 *   delete:
 *     summary: Delete a feedback by ID
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The feedback ID
 *     responses:
 *       204:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    await prisma.feedback.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/feedbacks/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 