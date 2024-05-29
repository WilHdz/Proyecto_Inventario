// src/Controllers/TransaccionesControl.ts
import { Request, Response } from 'express';
import { crearTransaccion, obtenerTransacciones } from '../Models/TransaccionesModelo';
import { notificarActualizaciontransacciones } from '../index';

export const createTransaccion = async (req: Request, res: Response) => {
  try {
    const { tipo, id_producto, cantidad } = req.body;
    await crearTransaccion({ tipo, id_producto, cantidad });
    res.status(201).json({ mensaje: 'Transacción creada exitosamente' });
    notificarActualizaciontransacciones();
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getTransacciones = async (req: Request, res: Response) => {
  try {
    const transacciones = await obtenerTransacciones();
    res.status(200).json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
