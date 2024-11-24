-- DropForeignKey
ALTER TABLE "ReservationItem" DROP CONSTRAINT "ReservationItem_reservationId_fkey";

-- AddForeignKey
ALTER TABLE "ReservationItem" ADD CONSTRAINT "ReservationItem_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
