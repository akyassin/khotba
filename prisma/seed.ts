// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.language.deleteMany();
  await prisma.speech.deleteMany();

    // Create some languages
  const swedish = await prisma.language.create({
    data: { name: 'Swedish' },
  });

  const arabic = await prisma.language.create({
    data: { name: 'Arabic' },
  });

  // Create some speeches with one-to-one self-relation
  const speech1 = await prisma.speech.create({
    data: {
      title: 'Första Svenska Khotba',
      body: 'Den här första svenska khotban.',
      languageId: swedish.id,
    },
  });

  const speech2 = await prisma.speech.create({
    data: {
      title: 'الخطبة العربية الأولى',
      body: '.هذه هي الخطبة العربية الأولى',
      languageId: arabic.id,
      relatedSpeechId: speech1.id, // Reference to the first speech
    },
  });

    // Update the first speech to have a relation to the second speech
  await prisma.speech.update({
    where: { id: speech1.id },
    data: { relatedSpeechId: speech2.id },
  });

  console.log({ swedish, arabic, speech1, speech2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
