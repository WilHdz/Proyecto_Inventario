// ProductosControl.ts
import { Request, Response } from 'express';
import { crearProducto, obtenerProductos } from '../Models/ProductosModelo';


export const createProducto = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, precio, cantidad } = req.body;
    await crearProducto({ nombre, descripcion, precio, cantidad });

    res.status(201).json({ mensaje: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await obtenerProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};