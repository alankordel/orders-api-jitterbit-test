CREATE TABLE Orders (
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
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
);

INSERT INTO Orders (orderId, value, creationDate) VALUES
(1, 120.50, NOW()),
(2, 300.00, NOW()),
(3, 89.90, NOW()),
(4, 450.75, NOW()),
(5, 60.00, NOW());

INSERT INTO Items (orderId, productId, quantity, price) VALUES
(1, 101, 2, 20.00),
(1, 102, 1, 80.50),

(2, 103, 3, 50.00),
(2, 104, 2, 75.00),

(3, 105, 1, 89.90),

(4, 106, 5, 50.00),
(4, 107, 1, 200.75),

(5, 108, 2, 30.00);