// Use the relative path directly
import { db } from '../lib/db';

; // Update the path to wherever you saved the code you just shared

async function main() {
  try {
    const category = await db.category.createMany({
      data: [
        { name: 'Computer Science' },
        { name: 'Music' },
        { name: 'Fitness' },
        { name: 'Photography' },
        { name: 'Accounting' },
        { name: 'Engineering' },
        { name: 'Filming' },
        { name: 'Game Design' },
      ],
      skipDuplicates: true, // Prevents errors if you run it twice
    });
    console.log('Success:', category);
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await db.$disconnect();
  }
}

main();