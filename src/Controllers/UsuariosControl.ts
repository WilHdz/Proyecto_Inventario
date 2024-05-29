  import { Request, Response } from 'express';
  import { crearUsuario, getAllUsuarios } from '../Models/UsuariosModelo';

  // Controlador para crear un nuevo usuario
  export const createUsuario = async (req: Request, res: Response) => {
    try {
      const { nombre, email, contraseña } = req.body;

      if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      await crearUsuario({ nombre, email, contraseña });
      res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Controlador para obtener todos los usuarios
  export const findAll = async (req: Request, res: Response) => {
    try {
      const nombre = req.query.nombre as string | undefined;

      const usuarios = await getAllUsuarios(nombre);
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
