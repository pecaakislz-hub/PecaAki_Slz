CREATE TABLE "WhatsAppMessage" (
  "id" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "fromPhone" TEXT NOT NULL,
  "toPhone" TEXT,
  "messageType" TEXT NOT NULL,
  "body" TEXT,
  "userId" TEXT,
  "storeProfileId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WhatsAppMessage_externalId_key" ON "WhatsAppMessage"("externalId");
CREATE INDEX "WhatsAppMessage_userId_idx" ON "WhatsAppMessage"("userId");
CREATE INDEX "WhatsAppMessage_storeProfileId_idx" ON "WhatsAppMessage"("storeProfileId");
CREATE INDEX "WhatsAppMessage_fromPhone_idx" ON "WhatsAppMessage"("fromPhone");
ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";
ALTER PUBLICATION supabase_realtime ADD TABLE "Purchase";
ALTER PUBLICATION supabase_realtime ADD TABLE "WhatsAppMessage";
