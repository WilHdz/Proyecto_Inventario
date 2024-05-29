import express, { Router } from 'express';
import { createProducto, getProductos } from '../Controllers/ProductosControl';
import { createTransaccion, getTransacciones } from '../Controllers/TransaccionesControl';
import { createUsuario, findAll } from '../Controllers/UsuariosControl';

const router: Router = express.Router();

router.post('/productos', createProducto);
router.get('/productos', getProductos);

router.post('/transacciones', createTransaccion);
router.get('/transacciones', getTransacciones);

router.post('/usuarios', createUsuario);
router.get('/usuarios', findAll);

export default router;
