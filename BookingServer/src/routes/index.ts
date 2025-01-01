import express from "express"
import AuthRouter from "./auth.routes"
import BookingRouter from "./booking.routes";
import BeautySalonRouter from "./salon.routes";
import ServiceRouter from "./services.routes";
import UserRouter from "./user.routes";

const apis = express.Router();

apis.use("/auth", AuthRouter);
apis.use("/beautysalons", BeautySalonRouter);
apis.use("/bookings", BookingRouter);
apis.use("/services", ServiceRouter);
apis.use("/user", UserRouter);


export default apis;
