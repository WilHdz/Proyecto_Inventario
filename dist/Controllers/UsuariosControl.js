"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = exports.createUsuario = void 0;
const UsuariosModelo_1 = require("../Models/UsuariosModelo");
// Controlador para crear un nuevo usuario
const createUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, email, contraseña } = req.body;
        if (!nombre || !email || !contraseña) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        yield (0, UsuariosModelo_1.crearUsuario)({ nombre, email, contraseña });
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    }
    catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.createUsuario = createUsuario;
// Controlador para obtener todos los usuarios
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nombre = req.query.nombre;
        const usuarios = yield (0, UsuariosModelo_1.getAllUsuarios)(nombre);
        res.status(200).json(usuarios);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.findAll = findAll;
