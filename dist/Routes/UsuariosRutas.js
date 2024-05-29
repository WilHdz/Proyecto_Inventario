"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsuariosControl_1 = require("../Controllers/UsuariosControl");
const router = express_1.default.Router();
router.post('/usuarios', UsuariosControl_1.createUsuario);
router.get('/usuarios', UsuariosControl_1.findAll);
exports.default = router;
