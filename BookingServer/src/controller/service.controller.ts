import { Request, Response } from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../services/serviceService';

export async function createServiceController(req: Request, res: Response) {
  const { name, price, durationInMin, salonId } = req.body;

  try {
    const service = await createService({ name, price, durationInMin, salonId });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating service' });
  }
}

export async function getAllServicesController(req: Request, res: Response) {
  const { page = 1, limit = 10, cityId } = req.query;

  try {
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const cityIdNumber = cityId ? parseInt(cityId as string, 10) : undefined;

    const services = await getAllServices(pageNumber, pageSize, cityIdNumber);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' });
  }
}

export async function getServiceController(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const service = await getServiceById(id);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching service' });
  }
}

export async function updateServiceController(req: Request, res: Response) {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const service = await updateService(id, { name, price });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error updating service' });
  }
}

export async function deleteServiceController(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await deleteService(id);
    res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service' });
  }
}
