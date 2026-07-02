import { Controller, Get, Param } from "@nestjs/common";
import { backend } from "../backend/instance.js";

const passenger = backend.passenger;

@Controller("api/passenger")
export class PassengerController {
  @Get("me")
  async currentPassenger() {
    return (await passenger.passengers.getCurrent()) ?? null;
  }

  @Get("config")
  config() {
    return passenger.passengerConfig.get();
  }

  @Get("tiers")
  tiers() {
    return passenger.tiers.list();
  }

  @Get("flights/:id/detail")
  async flightDetail(@Param("id") id: string) {
    return (await passenger.flights.findDetailById(id)) ?? null;
  }
}
