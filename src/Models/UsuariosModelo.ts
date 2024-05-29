import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

interface IUsuario {
  nombre: string;
  email: string;
  contraseña: string;
}

export const crearUsuario = async (usuario: IUsuario): Promise<void> => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)',
      [usuario.nombre, usuario.email, usuario.contraseña]
    );
  } catch (error) {
    console.error('Error al ejecutar la consulta SQL:', error);
    throw error; 
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const getAllUsuarios = async (nombre?: string): Promise<IUsuario[]> => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      nombre 
        ? 'SELECT * FROM usuarios WHERE nombre = ?' 
        : 'SELECT * FROM usuarios',
      nombre ? [nombre] : []
    );

    return rows as IUsuario[];
  } catch (error) {
    console.error('Error al ejecutar la consulta SQL:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
