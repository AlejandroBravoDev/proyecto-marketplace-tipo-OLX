// usuario.js
import bcrypt from 'bcrypt';

const usuario = [
  {
    name: "Administrador",
    email: "admin@example.com",
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  },
  {
    name: "Cliente Usuario",
    email: "cliente@example.com",
    password: bcrypt.hashSync('cliente123', 10),
    role: 'cliente'
  }
];

export default usuario;