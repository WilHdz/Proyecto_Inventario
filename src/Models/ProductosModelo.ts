import connection from '../Utils/DataBase';

interface IProducto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
}

export const crearProducto = async (producto: IProducto): Promise<void> => {
  const query = 'INSERT INTO Productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)';
  const { nombre, descripcion, precio, cantidad } = producto;
  await connection.execute(query, [nombre, descripcion, precio, cantidad]);
};

export const obtenerProductos = async (): Promise<IProducto[]> => {
  const [rows] = await connection.execute('SELECT * FROM Productos');
  return rows as IProducto[];
};
