import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }
  configureRoutes() {
    // (we'll add the actual route configuration here next)
    return this.app;
  }
}
