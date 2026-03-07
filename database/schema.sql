CREATE TABLE "Order" (
    orderId INT PRIMARY KEY,
    value DECIMAL(10,2),
    creationDate TIMESTAMP
);

CREATE TABLE Items (
    orderId INT,
    productId INT,
    quantity INT,
    price DECIMAL(10,2),
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES "Order"(orderId)
);