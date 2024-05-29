import connection from '../Utils/DataBase';

interface ITransaccion {
  id?: number;
  tipo: 'Venta' | 'Compra' | 'Ajuste';
  id_producto: number;
  cantidad: number;
  fecha?: Date;
}

export const crearTransaccion = async (transaccion: ITransaccion): Promise<void> => {
  const query = 'INSERT INTO Transacciones (tipo, id_producto, cantidad) VALUES (?, ?, ?)';
  const { tipo, id_producto, cantidad } = transaccion;
  await connection.execute(query, [tipo, id_producto, cantidad]);
};

export const obtenerTransacciones = async (): Promise<ITransaccion[]> => {
  const [rows] = await connection.execute('SELECT * FROM Transacciones');
  return rows as ITransaccion[];
};
