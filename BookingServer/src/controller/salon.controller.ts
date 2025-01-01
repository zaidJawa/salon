import { Request, Response } from 'express';
import {
  createBeautySalon,
  getAllBeautySalons,
  getBeautySalonById,
  updateBeautySalon,
  deleteBeautySalon,
} from '../services/beautySalonService';

export const createBeautySalonController = async (req: Request, res: Response) => {
  const { name, location, phone, services, startWorkingHours, endWorkingHours } = req.body;
  try {
    const beautySalon = await createBeautySalon({ startWorkingHours, endWorkingHours, name, location, phone, services });
    res.status(201).json(beautySalon);
  } catch (error) {
    res.status(500).json({ error: 'Error creating beauty salon' });
  }
};

export const getAllBeautySalonsController = async (req: Request, res: Response) => {
  try {
    const beautySalons = await getAllBeautySalons();
    res.status(200).json(beautySalons);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching beauty salons' });
  }
};

export const getBeautySalonController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const beautySalon = await getBeautySalonById(id);
    if (beautySalon) {
      res.status(200).json(beautySalon);
    } else {
      res.status(404).json({ error: 'Beauty salon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching beauty salon' });
  }
};

export const updateBeautySalonController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, location, phone } = req.body;
  try {
    const beautySalon = await updateBeautySalon(id, { name, location, phone });
    res.status(200).json(beautySalon);
  } catch (error) {
    res.status(500).json({ error: 'Error updating beauty salon' });
  }
};

export const deleteBeautySalonController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteBeautySalon(id);
    res.status(200).json({ message: 'Beauty salon deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting beauty salon' });
  }
};
