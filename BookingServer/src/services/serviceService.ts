import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createService(data: { name: string; price: number; durationInMin: number; salonId: string }) {
    return prisma.services.create({
        data,
    });
}

export async function getAllServices(page: number, limit: number, cityId?: number) {
    const query: any = {};

    if (cityId && cityId > 0) {
        query.cityId = cityId;
    }

    const totalCount = await prisma.services.count({ where: query });

    const services = await prisma.services.findMany({
        where: query,
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        docs: services,
        totalDocs: totalCount,
        limit,
        page,
        totalPages: Math.ceil(totalCount / limit),
    };
}

export async function getServiceById(id: string) {
    return prisma.services.findUnique({ where: { id } });
}

export async function updateService(id: string, data: { name?: string; price?: number }) {
    return prisma.services.update({
        where: { id },
        data,
    });
}

export async function deleteService(id: string) {
    return prisma.services.delete({
        where: { id },
    });
}
