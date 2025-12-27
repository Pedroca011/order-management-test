import mongoose from "mongoose";
import Logging from "../library/Logging";
import { roleService } from "../services";
import config from "../config/config";

const connectDatabse = (StartServer) => {
  mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
      Logging.info(`Running on ENV = ${process.env.NODE_ENV}`);
      Logging.info("Connected to mongoDB.");
      StartServer()
      roleService.createDefaultRoles();
    })
    .catch((error) => {
      Logging.error("Unable to connect.");
      Logging.error(error);
    });
};

export default connectDatabse;