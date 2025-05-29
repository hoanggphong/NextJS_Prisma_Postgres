import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Returns all feedbacks
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: List of feedbacks
 */
export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        author: true,
        product: true,
      },
    });
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/feedbacks:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *               authorId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Feedback created successfully
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feedback = await prisma.feedback.create({
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
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 