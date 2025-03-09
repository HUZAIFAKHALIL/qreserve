/*
  Warnings:

  - You are about to drop the column `activityType` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `ageGroup` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `airlineName` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `amenities` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `availableEndTime` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `availableStartTime` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `carCapacity` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `carModel` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `carType` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `equipment` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `flightClass` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `gymFacilities` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `hallCapacity` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `hotelStars` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `membershipTypes` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `noOfRooms` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `operatingHours` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `playgroundType` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `roomType` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `salonSpecialty` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `seatsAvailable` on the `Service` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUYER', 'SELLER', 'ADMIN');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "activityType",
DROP COLUMN "ageGroup",
DROP COLUMN "airlineName",
DROP COLUMN "amenities",
DROP COLUMN "availableEndTime",
DROP COLUMN "availableStartTime",
DROP COLUMN "carCapacity",
DROP COLUMN "carModel",
DROP COLUMN "carType",
DROP COLUMN "equipment",
DROP COLUMN "eventType",
DROP COLUMN "flightClass",
DROP COLUMN "gymFacilities",
DROP COLUMN "hallCapacity",
DROP COLUMN "hotelStars",
DROP COLUMN "membershipTypes",
DROP COLUMN "noOfRooms",
DROP COLUMN "operatingHours",
DROP COLUMN "playgroundType",
DROP COLUMN "price",
DROP COLUMN "roomType",
DROP COLUMN "salonSpecialty",
DROP COLUMN "seatsAvailable",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'BUYER';

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalonService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "salonSpecialty" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalonService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "roomType" TEXT NOT NULL,
    "amenities" TEXT,
    "hotelStars" INTEGER,
    "noOfRooms" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HotelService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "carModel" TEXT NOT NULL,
    "carType" TEXT NOT NULL,
    "carCapacity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CarService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "gymFacilities" TEXT,
    "membershipTypes" TEXT,
    "operatingHours" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GymService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "airlineName" TEXT NOT NULL,
    "flightClass" TEXT NOT NULL,
    "seatsAvailable" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FlightService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HallService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "hallCapacity" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HallService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "activityType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ActivityService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaygroundService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "playgroundType" TEXT NOT NULL,
    "ageGroup" TEXT,
    "equipment" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PlaygroundService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerRequest" (
    "id" SERIAL NOT NULL,
    "requestUser" INTEGER NOT NULL,
    "partnerUser" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filter" JSONB NOT NULL,
    "reservationItemID" INTEGER NOT NULL,

    CONSTRAINT "PartnerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedReservation" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompletedReservation_reservationId_key" ON "CompletedReservation"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalonService" ADD CONSTRAINT "SalonService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelService" ADD CONSTRAINT "HotelService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarService" ADD CONSTRAINT "CarService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymService" ADD CONSTRAINT "GymService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightService" ADD CONSTRAINT "FlightService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HallService" ADD CONSTRAINT "HallService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityService" ADD CONSTRAINT "ActivityService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaygroundService" ADD CONSTRAINT "PlaygroundService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerRequest" ADD CONSTRAINT "PartnerRequest_reservationItemID_fkey" FOREIGN KEY ("reservationItemID") REFERENCES "ReservationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerRequest" ADD CONSTRAINT "PartnerRequest_requestUser_fkey" FOREIGN KEY ("requestUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerRequest" ADD CONSTRAINT "PartnerRequest_partnerUser_fkey" FOREIGN KEY ("partnerUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedReservation" ADD CONSTRAINT "CompletedReservation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "ReservationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedReservation" ADD CONSTRAINT "CompletedReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "ReservationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
