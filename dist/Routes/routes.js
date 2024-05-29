"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductosControl_1 = require("../Controllers/ProductosControl");
const TransaccionesControl_1 = require("../Controllers/TransaccionesControl");
const UsuariosControl_1 = require("../Controllers/UsuariosControl");
const router = express_1.default.Router();
router.post('/productos', ProductosControl_1.createProducto);
router.get('/productos', ProductosControl_1.getProductos);
router.post('/transacciones', TransaccionesControl_1.createTransaccion);
router.get('/transacciones', TransaccionesControl_1.getTransacciones);
router.post('/usuarios', UsuariosControl_1.createUsuario);
router.get('/usuarios', UsuariosControl_1.findAll);
exports.default = router;
