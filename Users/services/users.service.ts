import UsersDao from "../daos/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource); //string
  }

  async deleteById(id: string) {
    return UsersDao.removeUserById(id); //string
  }

  async list(limit: number, page: number) {
    return UsersDao.getUsers(); //CreateUserDto[]
  }

  async patchById(id: string, resource: PatchUserDto) {
    return UsersDao.patchUserById(id, resource); //string
  }

  async readById(id: string) {
    return UsersDao.getUserById(id); //CreateUserDto | undefined
  }

  async putById(id: string, resource: PutUserDto) {
    return UsersDao.putUserById(id, resource); // string
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email); //CreateUserDto | null
  }
}

export default new UsersService();
