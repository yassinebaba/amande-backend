-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idReservation" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "heure" TEXT NOT NULL,
    "estheticienne" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "commentaire" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'En cours'
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_idReservation_key" ON "Reservation"("idReservation");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
