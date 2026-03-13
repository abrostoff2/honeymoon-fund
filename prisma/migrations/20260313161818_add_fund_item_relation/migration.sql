-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "message" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "ecardTemplate" TEXT,
    "ecardMessage" TEXT,
    "fundItemId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "confirmedAt" DATETIME,
    "notes" TEXT,
    CONSTRAINT "Contribution_fundItemId_fkey" FOREIGN KEY ("fundItemId") REFERENCES "FundItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contribution" ("amount", "confirmedAt", "createdAt", "ecardMessage", "ecardTemplate", "guestEmail", "guestName", "id", "message", "notes", "paymentMethod", "status", "updatedAt") SELECT "amount", "confirmedAt", "createdAt", "ecardMessage", "ecardTemplate", "guestEmail", "guestName", "id", "message", "notes", "paymentMethod", "status", "updatedAt" FROM "Contribution";
DROP TABLE "Contribution";
ALTER TABLE "new_Contribution" RENAME TO "Contribution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
