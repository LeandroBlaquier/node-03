import shortid from "shortid";
import debug from "debug";

import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  //users: Array<CreateUserDto> = [];
  users: CreateUserDto[] = [];

  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );

  User = mongooseService.getMongoose().model("Users", this.userSchema);
  // users: CreateUserDto[] = []; forma moderna
  constructor() {
    log("Created new instance of UsersDao");
  }

  //función de creacion:
  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return userId;
  }

  //La lectura vendrá en dos sabores, "leer todos los recursos" y "leer uno por ID"

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate("User").exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  //actualizar significa sobrescribir el objeto completo (como un PUT)
  //o sólo partes del objeto (como un PATCH):

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId }, //fltro
      { $set: userFields }, //valores
      { new: true } //crear en caso de quen exisa
    ).exec();

    return existingUser;
  }

  //para eliminar un recurso

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
