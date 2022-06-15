import shortid from "shortid";
import debug from "debug";

import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  //users: Array<CreateUserDto> = [];
  users: CreateUserDto[] = []; //forma moderna
  constructor() {
    log("Created new instance of UsersDao");
  }

  //función de creacion:
  async addUser(user: CreateUserDto) {
    user.id = shortid.generate();
    this.users.push(user);
    return user.id;
  }

  //La lectura vendrá en dos sabores, "leer todos los recursos" y "leer uno por ID"

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    return this.users.find((user: { id: string }) => user.id === userId);
  }

  //actualizar significa sobrescribir el objeto completo (como un PUT)
  //o sólo partes del objeto (como un PATCH):

  async putUserById(userId: string, user: PutUserDto) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(objIndex, 1, user); // con 0 agrego con 1 actualizo
    return `${user.id} updated via put`;
  }

  async patchUserById(userId: string, user: PatchUserDto) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    let currentUser = this.users[objIndex];
    const allowedPatchFields = [
      "password",
      "firstName",
      "lastName",
      "permissionLevel",
    ];
    for (let field of allowedPatchFields) {
      if (field in user) {
        // @ts-ignore
        currentUser[field] = user[field];
      }
    }
    this.users.splice(objIndex, 1, currentUser);
    return `${user.id} patched`;
  }
  //para eliminar un recurso
  async removeUserById(userId: string) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(objIndex, 1);
    return `${userId} removed`;
  }

  //sabiendo que una condición previa para crear un usuario es
  //validar si el correo electrónico del usuario no está duplicado:
  async getUserByEmail(email: string) {
    const objIndex = this.users.findIndex(
      (obj: { email: string }) => obj.email === email
    );
    let currentUser = this.users[objIndex];
    if (currentUser) {
      return currentUser;
    } else {
      return null;
    }
  }
}

export default new UsersDao();
