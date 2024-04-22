   CREATE TABLE "competitor_products"(
    "id" CHAR(36) PRIMARY KEY,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "updated_at" TIMESTAMP NOT NULL
);

CREATE TABLE "price_history"(
    "product_id" CHAR(36) REFERENCES "competitior_products"("id"),
    "timestamp" TIMESTAMP NOT NULL,
    "price" BIGINT NOT NULL,
    PRIMARY KEY ("product_id", "timestamp"),
    FOREIGN KEY ("product_id") REFERENCES "competitior_products"("id")
);
