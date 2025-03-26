-- CreateEnum
CREATE TYPE "DiningOption" AS ENUM ('INDOOR', 'OUTDOOR');

-- CreateTable
CREATE TABLE "RestaurantService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "diningOption" "DiningOption" NOT NULL,
    "numPersons" INTEGER NOT NULL,
    "seatsAvailable" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantService" ADD CONSTRAINT "RestaurantService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
