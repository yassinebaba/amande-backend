-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "idReservation" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "heure" TEXT NOT NULL,
    "estheticienne" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "commentaire" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'En cours',

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_idReservation_key" ON "Reservation"("idReservation");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
