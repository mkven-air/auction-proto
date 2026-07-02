import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import type { FlightQuery } from "@auction/api-contracts/admin";
import { FlightQuerySchema, RulesSchema } from "@auction/api-contracts/schemas";
import type { BidProduct, Rules } from "@auction/core";
import { backend, parseIds } from "../backend/instance.js";
import { ZodValidationPipe } from "../pipes/zodValidation.js";

const admin = backend.admin;

@Controller("api/admin")
export class AdminController {
  @Get("flights/summary")
  flightsSummary() {
    return admin.flights.getSummary();
  }

  @Post("flights/query")
  flightsQuery(@Body(new ZodValidationPipe(FlightQuerySchema)) query: FlightQuery) {
    return admin.flights.query(query);
  }

  @Get("flights/:id/detail")
  async flightDetail(@Param("id") id: string) {
    return (await admin.flights.findDetailById(id)) ?? null;
  }

  @Get("flights/:id/bids")
  flightBids(@Param("id") id: string, @Query("product") product: string) {
    return admin.bids.list(id, product as BidProduct);
  }

  @Post("flights/:id/bids/auto-select")
  autoSelectBids(@Param("id") id: string) {
    return admin.bids.autoSelect(id);
  }

  @Post("flights/:id/bids/:bidId/approve")
  async approveBid(@Param("id") id: string, @Param("bidId") bidId: string) {
    return (await admin.bids.approve(id, Number(bidId))) ?? null;
  }

  @Post("flights/:id/bids/:bidId/reject")
  async rejectBid(@Param("id") id: string, @Param("bidId") bidId: string) {
    return (await admin.bids.reject(id, Number(bidId))) ?? null;
  }

  @Get("flights/:id")
  async flightById(@Param("id") id: string) {
    return (await admin.flights.findById(id)) ?? null;
  }

  @Get("rules")
  getRules() {
    return admin.rules.get();
  }

  @Put("rules")
  updateRules(@Body(new ZodValidationPipe(RulesSchema)) rules: Rules) {
    return admin.rules.update(rules);
  }

  @Get("entities")
  entities() {
    return admin.entities.listAll();
  }

  @Get("airports/with-location")
  airportsWithLocation(@Query("ids") ids: string) {
    return admin.airports.findWithLocationByIds(parseIds(ids));
  }

  @Get("airports")
  airports(@Query("ids") ids: string) {
    return admin.airports.findByIds(parseIds(ids));
  }

  @Get("cities")
  cities(@Query("ids") ids: string) {
    return admin.cities.findByIds(parseIds(ids));
  }

  @Get("countries")
  countries(@Query("ids") ids: string) {
    return admin.countries.findByIds(parseIds(ids));
  }

  @Get("tiers")
  tiers() {
    return admin.tiers.list();
  }

  @Get("bid-states")
  bidStates() {
    return admin.bidStates.list();
  }

  @Get("flight-statuses")
  flightStatuses() {
    return admin.flightStatuses.list();
  }

  @Get("flight-hauls")
  flightHauls() {
    return admin.flightHauls.list();
  }
}
