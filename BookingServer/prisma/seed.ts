import { PrismaClient, Role, Status } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const prisma = new PrismaClient();

const userData = [
  {
    id: uuidv4(),
    name: 'Alice',
    email: 'alice@prisma.io',
    phone: '1234567890',
    password: 'hashedPassword1',
    role: Role.super_admin,
    salons: {
      create: [
        {
          assignedAt: new Date(),
          salon: {
            connectOrCreate: {
              where: { name: 'Beauty Salon A' },
              create: {
                id: uuidv4(),
                name: 'Beauty Salon A',
                location: 'Location A',
                phone: '0987654321',
                startWorkingHours: '09:00:00',
                endWorkingHours: '18:00:00',
              },
            },
          },
        },
      ],
    },
  },
  {
    id: uuidv4(),
    name: 'Nilu',
    email: 'nilu@prisma.io',
    phone: '1234567891',
    password: 'hashedPassword2',
    role: Role.admin,
    salons: {
      create: [
        {
          assignedAt: new Date(),
          salon: {
            connectOrCreate: {
              where: { name: 'Beauty Salon B' },
              create: {
                id: uuidv4(),
                name: 'Beauty Salon B',
                location: 'Location B',
                phone: '0987654322',
                startWorkingHours: '10:00:00',
                endWorkingHours: '19:00:00',
              },
            },
          },
        },
      ],
    },
  },
  {
    id: uuidv4(),
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    phone: '1234567892',
    password: 'hashedPassword3',
    role: Role.user,
    salons: {
      create: [
        {
          assignedAt: new Date(),
          salon: {
            connectOrCreate: {
              where: { name: 'Beauty Salon C' },
              create: {
                id: uuidv4(),
                name: 'Beauty Salon C',
                location: 'Location C',
                phone: '0987654323',
                startWorkingHours: '11:00:00',
                endWorkingHours: '20:00:00',
              },
            },
          },
        },
      ],
    },
  },
];

const bookingsData = [
  {
    userEmail: 'alice@prisma.io',
    salonName: 'Beauty Salon A',
    services: [
      {
        id: uuidv4(),
        name: 'Facial',
        price: 30.0,
        durationInMin: 45,
      },
      {
        id: uuidv4(),
        name: 'Haircut',
        price: 20.0,
        durationInMin: 30,
      },
    ],
    date: new Date('2024-01-15T10:00:00Z'),
    status: Status.approved,
  },
  {
    userEmail: 'nilu@prisma.io',
    salonName: 'Beauty Salon B',
    services: [
      {
        id: uuidv4(),
        name: 'Haircut',
        price: 20.0,
        durationInMin: 30,
      },
    ],
    date: new Date('2024-01-16T14:00:00Z'),
    status: Status.pending,
  },
  {
    userEmail: 'mahmoud@prisma.io',
    salonName: 'Beauty Salon C',
    services: [
      {
        id: uuidv4(),
        name: 'Massage',
        price: 50.0,
        durationInMin: 60,
      },
    ],
    date: new Date('2024-01-17T18:00:00Z'),
    status: Status.pending,
  },
];

async function main() {
  console.log(`Start seeding users and salons...`);

  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    console.log(`Upserted user with id: ${user.id}`);
  }

  console.log(`Start seeding bookings...`);

  for (const b of bookingsData) {
    const user = await prisma.user.findUnique({ where: { email: b.userEmail } });
    const salon = await prisma.beautySalon.findFirst({ where: { name: b.salonName } });

    if (user && salon) {
      // Create services for the booking
      const serviceIds = [];
      for (const serviceData of b.services) {
        // Create or update services
        const service = await prisma.services.upsert({
          where: { id: serviceData.id },
          update: {},
          create: {
            id: serviceData.id,
            name: serviceData.name,
            price: serviceData.price,
            durationInMin: serviceData.durationInMin,
            salonId: salon.id,
          },
        });
        serviceIds.push(service.id);
      }

    } else {
      console.warn(
        `Failed to create booking: User or Salon not found for ${b.userEmail} and ${b.salonName}`
      );
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
