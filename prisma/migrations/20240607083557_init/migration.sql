-- CreateTable
CREATE TABLE "Speech" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "relatedSpeechId" INTEGER,
    CONSTRAINT "Speech_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Speech_relatedSpeechId_fkey" FOREIGN KEY ("relatedSpeechId") REFERENCES "Speech" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Language" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Speech_relatedSpeechId_key" ON "Speech"("relatedSpeechId");
