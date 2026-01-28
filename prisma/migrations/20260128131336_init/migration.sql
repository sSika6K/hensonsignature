-- CreateTable
CREATE TABLE "Guitar" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "neck" TEXT NOT NULL,
    "pickups" TEXT NOT NULL,
    "hardware" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guitar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guitar_name_key" ON "Guitar"("name");
