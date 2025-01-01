import express from 'express'
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import winston from "winston";
import expressWinston from "express-winston";
import logger from "./utils/logger";
import errorHandler from "./middleware/errorHandler";
import v1Router from "./routes";
import swaggerSpec from './utils/swagger';
import swaggerUi from 'swagger-ui-express';


const app = express()
app.use(express.json())

dotenv.config();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));


app.use(
  express.json({
    limit: "100MB",
  })
);

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "requests.log",
      }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: (req, res) => false,
  })
);


// Error handling middleware
app.use(errorHandler);
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "errors.log",
      }),
    ],
  })
);


const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Use Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cookieParser());
app.use("/api", v1Router);
app.listen(PORT, async () => {

  logger.info("Server is running");
  console.log(`🚀 Server ready at http://${CLIENT_URL}:${PORT}`);
});
