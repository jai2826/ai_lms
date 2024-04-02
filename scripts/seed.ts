const { PrismaClient } = require('@prisma/client');
const database = new PrismaClient();
const db = new PrismaClient();

async function main() {
  try {
    const category = await database.category.createMany({
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
    });
    // const socialType = await database.socialsType.createMany({
    //   data: [
    //     // 
    //   ],
    // });
    if (category) console.log(category, 'Success');
    // if (socialType) console.log(socialType, 'Success');
  } catch (error) {
    console.log('Error seeding the database categories', error);
  } finally {
    await database.$disconnect;
  }
}

main();



// async function Test() {
//   try {
//     const topic = await database.topic.createMany({
//       data: [
//        {name:'Nextjs', categoryId:''}
//       ],
//     });
    
//     if (topic) console.log(topic, 'Success');
//     // if (socialType) console.log(socialType, 'Success');
//   } catch (error) {
//     console.log('Error seeding the database categories', error);
//   } finally {
//     await database.$disconnect;
//   }
// }

// Test();
