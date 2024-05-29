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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsuarios = exports.crearUsuario = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crearUsuario = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield promise_1.default.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        yield connection.execute('INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)', [usuario.nombre, usuario.email, usuario.contraseña]);
    }
    catch (error) {
        console.error('Error al ejecutar la consulta SQL:', error);
        throw error;
    }
    finally {
        if (connection) {
            yield connection.end();
        }
    }
});
exports.crearUsuario = crearUsuario;
const getAllUsuarios = (nombre) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield promise_1.default.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        const [rows] = yield connection.execute(nombre
            ? 'SELECT * FROM usuarios WHERE nombre = ?'
            : 'SELECT * FROM usuarios', nombre ? [nombre] : []);
        return rows;
    }
    catch (error) {
        console.error('Error al ejecutar la consulta SQL:', error);
        throw error;
    }
    finally {
        if (connection) {
            yield connection.end();
        }
    }
});
exports.getAllUsuarios = getAllUsuarios;
