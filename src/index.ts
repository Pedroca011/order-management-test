import express from "express";
import config from "./config/config";
import Logging from "./library/Logging";
import http from "http";
import { router as v1 } from './routes/v1/index';
import HttpError from "./utils/httpError";
import connectDatabse from "./db/db";

const router = express();

const StartServer = async () => {
  router.use((req, res, next) => {
    Logging.info(
      `Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );
    res.on("finish", () => {
      Logging.info(
        `Incomming -> Method: [${req.method}] - Url: [${req.url}] IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  //RULES OF OUR APIS
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-with,Content-Type,Accept,Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});
    }
    next();
  });

  //API ROUTES WITH VERSION
  router.use("/api", v1);

  //API MAIN ROUTER "/"
  router.get("/", (_, res) => {
    res.status(200).json({
      success: true,
      message: "Api test runner...",
    });
  });

  //API ERROR HANDLING
  router.use((req, res, next) => {
    const error = new Error("not found");
    Logging.error(error);
    return res.status(404).json({ success: false, message: error.message });
  });

  //HANDEL ALL ERROR THROW BY CONTROLLERS
  router.use(function (err: any, req: any, res: any, next: any) {
    Logging.error(err.stack);

    if (err instanceof HttpError) {
      return err.sendError(res);
    } else {
      return res.status(500).json({
        error: {
          title: "general_error",
          detail: "An error occurred, Please retry again later",
          code: 500,
        },
      });
    }
  });

  //YOUR SERVER LISTEN
  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}.`)
    );
};

// CONNECT DATABASE
connectDatabse(StartServer);

