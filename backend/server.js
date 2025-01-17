const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL connection
const port = 8081;
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "budgettrackerdb",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// Test route
app.get("/", (req, res) => {
    return res.json("BACKEND SAID HI PARVEZ");
});

// SIGN UP PAGE
// Add customer registration endpoint

app.post("/customer/register", (req, res) => {
    const {
        customer_name,
        email,
        username,
        password,
        phone_number,
        address,
        customer_image,
    } = req.body;
    const customer_level = 2; // Hardcoded customer level
    const query = `
        INSERT INTO Customers (customer_level, customer_name, email, username, password, phone_number, address, customer_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log(query); // Log the query before executing it

    db.query(
        query,
        [
            customer_level,
            customer_name,
            email,
            username,
            password,
            phone_number,
            address,
            customer_image,
        ],
        (err, results) => {
            if (err) {
                console.error("Error registering customer:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json({ success: true, customer_id: results.insertId });
        }
    );
});

app.post("/seller/register", (req, res) => {
    const {
        username,
        password,
        seller_name,
        email,
        phone_number,
        address,
        seller_image,
    } = req.body;
    const query = `
        INSERT INTO Sellers (username, password, seller_name, email, phone_number, address, seller_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        query,
        [
            username,
            password,
            seller_name,
            email,
            phone_number,
            address,
            seller_image,
        ],
        (err, results) => {
            if (err) {
                console.error("Error registering seller:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json({ success: true, seller_id: results.insertId });
        }
    );
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const query = "SELECT * FROM customers WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res
                .status(500)
                .json({ success: false, message: "Database query error" });
        }

        if (results.length > 0) {
            const user = results[0];
            console.log(res[0]);
            return res.json({
                success: true,
                customerID: user.customer_id,
                username: user.username,
                email: user.email,
                address: user.address,
                customerName: user.customer_name,
            });
        } else {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// SHOPS PART CODES
// Create a new shop
app.post("/shops", (req, res) => {
    const {
        shop_name,
        seller_id,
        shop_image,
        area_code,
        area_name,
        full_address,
        shop_rating,
    } = req.body;
    const query =
        "INSERT INTO shops (shop_name, seller_id, shop_image, area_code, area_name, full_address, shop_rating) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
        query,
        [
            shop_name,
            seller_id,
            shop_image,
            area_code,
            area_name,
            full_address,
            shop_rating,
        ],
        (err, results) => {
            if (err) {
                console.error("Error creating shop:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json({ success: true, shop_id: results.insertId });
        }
    );
});

// Fetch all shops
app.get("/shops", (req, res) => {
    db.query("SELECT * FROM shops", (err, results) => {
        if (err) {
            console.error("Error fetching shops:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Fetch a single shop by ID
app.get("/shops/:shop_id", (req, res) => {
    const { shop_id } = req.params;
    const query = "SELECT * FROM shops WHERE shop_id = ?";
    db.query(query, [shop_id], (err, results) => {
        if (err) {
            console.error("Error fetching shop:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: "Shop not found" });
        }
    });
});

// Update a shop by ID
app.put("/shops/:shop_id", (req, res) => {
    const { shop_id } = req.params;
    const {
        shop_name,
        seller_id,
        shop_image,
        area_code,
        area_name,
        full_address,
        shop_rating,
    } = req.body;
    const query =
        "UPDATE shops SET shop_name = ?, seller_id = ?, shop_image = ?, area_code = ?, area_name = ?, full_address = ?, shop_rating = ? WHERE shop_id = ?";
    db.query(
        query,
        [
            shop_name,
            seller_id,
            shop_image,
            area_code,
            area_name,
            full_address,
            shop_rating,
            shop_id,
        ],
        (err, results) => {
            if (err) {
                console.error("Error updating shop:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json({ success: true, message: "Shop updated successfully" });
        }
    );
});

// Delete a shop by ID
app.delete("/shops/:shop_id", (req, res) => {
    const { shop_id } = req.params;
    const query = "DELETE FROM shops WHERE shop_id = ?";
    db.query(query, [shop_id], (err, results) => {
        if (err) {
            console.error("Error deleting shop:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ success: true, message: "Shop deleted successfully" });
    });
});

// Fetch shops by area name
app.get("/shops/area-name/:area_name", (req, res) => {
    const { area_name } = req.params;
    const query = "SELECT * FROM shops WHERE area_name = ?";
    db.query(query, [area_name], (err, results) => {
        if (err) {
            console.error("Error fetching shops by area name:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Fetch distinct product IDs for a specific shop
app.get("/shops/:shop_id/products", (req, res) => {
    const { shop_id } = req.params;
    const query = `
        SELECT p.product_id, p.title, p.price, p.description, p.image_url
        FROM shop_products sp
        JOIN products p ON sp.product_id = p.product_id
        WHERE sp.shop_id = ?
    `;
    db.query(query, [shop_id], (err, results) => {
        if (err) {
            console.error("Error fetching product details for shop:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Add item to Cart
app.post("/cart", (req, res) => {
    const { customer_id, product_id, quantity } = req.body;

    // Check if the item already exists in the cart
    const checkQuery =
        "SELECT * FROM Cart WHERE customer_id = ? AND product_id = ?";
    db.query(checkQuery, [customer_id, product_id], (err, results) => {
        if (err) {
            console.error("Error checking cart item:", err);
            return res.status(500).json({ error: "Database query error" });
        }

        if (results.length > 0) {
            // Item already exists in the cart, update the quantity
            const updateQuery =
                "UPDATE Cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?";
            db.query(
                updateQuery,
                [quantity, customer_id, product_id],
                (err, result) => {
                    if (err) {
                        console.error("Error updating cart item:", err);
                        return res
                            .status(500)
                            .json({ error: "Database query error" });
                    }
                    res.json({
                        success: true,
                        message: "Item quantity updated in cart",
                    });
                }
            );
        } else {
            // Item does not exist in the cart, insert a new row
            const insertQuery =
                "INSERT INTO Cart (customer_id, product_id, quantity) VALUES (?, ?, ?)";
            db.query(
                insertQuery,
                [customer_id, product_id, quantity],
                (err, result) => {
                    if (err) {
                        console.error("Error adding item to cart:", err);
                        return res
                            .status(500)
                            .json({ error: "Database query error" });
                    }
                    res.json({ success: true, message: "Item added to cart" });
                }
            );
        }
    });
});

// Fetch cart items for a specific customer
app.get("/cart/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const query = `
        SELECT c.cart_id, c.quantity, p.product_id, p.title, p.price, p.description, p.image_url
        FROM Cart c
        JOIN Products p ON c.product_id = p.product_id
        WHERE c.customer_id = ?
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            console.error("Error fetching cart items:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Add a new item to the cart
app.post("/cart", (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    const query = `
        INSERT INTO Cart (customer_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;
    db.query(query, [customer_id, product_id, quantity], (err, results) => {
        if (err) {
            console.error("Error adding item to cart:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ message: "Item added to cart successfully" });
    });
});

// Update quantity of a cart item
app.put("/cart", (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    const query = `
        UPDATE Cart
        SET quantity = ?
        WHERE customer_id = ? AND product_id = ?
    `;
    db.query(query, [quantity, customer_id, product_id], (err, results) => {
        if (err) {
            console.error("Error updating cart item quantity:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ message: "Cart item quantity updated successfully" });
    });
});

// Delete a cart item
app.delete("/cart", (req, res) => {
    const { customer_id, product_id } = req.body;
    const query = `
        DELETE FROM Cart
        WHERE customer_id = ? AND product_id = ?
    `;
    db.query(query, [customer_id, product_id], (err, results) => {
        if (err) {
            console.error("Error deleting cart item:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ message: "Cart item deleted successfully" });
    });
});

// WITHOUT LOGIN PAGE -> HOME
// Fetch product categories
app.get("/categories", (req, res) => {
    const query = "SELECT * FROM product_category";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching product categories:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// CUSTOMER PROFILE PAGE
// Fetch customer information
app.get("/customer/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const query = "SELECT * FROM Customers WHERE customer_id = ?";
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            console.error("Error fetching customer information:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(results[0]);
    });
});

// Update customer information
app.put("/customer/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const {
        customer_level,
        customer_name,
        email,
        username,
        phone_number,
        address,
        customer_image,
    } = req.body;
    const query = `
        UPDATE Customers
        SET customer_level = ?, customer_name = ?, email = ?, username = ?, phone_number = ?, address = ?, customer_image = ?
        WHERE customer_id = ?
    `;
    db.query(
        query,
        [
            customer_level,
            customer_name,
            email,
            username,
            phone_number,
            address,
            customer_image,
            customer_id,
        ],
        (err, results) => {
            if (err) {
                console.error("Error updating customer information:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json({ success: true });
        }
    );
});

// DUE PAYMENT PAGE
// Fetch due payments for a specific customer
app.get("/customer/:customerId/due-payments", (req, res) => {
    const { customerId } = req.params;
    const query = `
        SELECT dp.due_id, s.shop_name, dp.due_date, dp.payment_status, dp.Amount, dp.partial_payment_amount, dp.payment_reason
        FROM due_payment dp
        JOIN shops s ON dp.shop_id = s.shop_id
        WHERE dp.customer_id = ?
    `;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching due payments:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// CUSTOMER SHOP PAGE
// Add a shop to favourite shops
app.post("/customer/:customerId/favourite-shops", (req, res) => {
    const { customerId } = req.params;
    const { shopId } = req.body;
    const query = `
        INSERT INTO favourite_shops (customer_id, shop_id)
        VALUES (?, ?)
    `;
    db.query(query, [customerId, shopId], (err, result) => {
        if (err) {
            console.error("Error adding favourite shop:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ success: true, fs_id: result.insertId });
    });
});

// Remove a shop from favourite shops
app.delete("/customer/:customerId/favourite-shops/:shopId", (req, res) => {
    const { customerId, shopId } = req.params;
    const query = `
        DELETE FROM favourite_shops
        WHERE customer_id = ? AND shop_id = ?
    `;
    db.query(query, [customerId, shopId], (err, result) => {
        if (err) {
            console.error("Error removing favourite shop:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ success: true });
    });
});

// Fetch favourite shops for a specific customer
app.get("/customer/:customerId/favourite-shops", (req, res) => {
    const { customerId } = req.params;
    const query = `
        SELECT shop_id
        FROM favourite_shops
        WHERE customer_id = ?
    `;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching favourite shops:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results.map((result) => result.shop_id));
    });
});

// Fetch favourite shops for a specific customer
app.get("/customer/:customerId/favourite-shops-main", (req, res) => {
    const { customerId } = req.params;
    const query = `
        SELECT fs.fs_id, s.shop_id, s.shop_name, s.shop_image
        FROM favourite_shops fs
        JOIN shops s ON fs.shop_id = s.shop_id
        WHERE fs.customer_id = ?
    `;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching favourite shops:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// CUSTOMER STATEMENT Page
// Fetch unique months from orders for a specific customer
app.get("/customer/:customerId/order-months", (req, res) => {
    const { customerId } = req.params;
    const query = `
        SELECT DISTINCT DATE_FORMAT(order_date, '%Y-%m') AS month
        FROM orders
        WHERE customer_id = ?
        ORDER BY month
    `;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching order months:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results.map((result) => result.month));
    });
});

// Fetch statements for a specific customer
app.get("/customer/:customerId/statements", (req, res) => {
    const { customerId } = req.params;
    const query = `
        SELECT s.statement_id, o.order_date, o.total_price, o.status, sh.shop_name
        FROM statement s
        JOIN orders o ON s.order_id = o.order_id
        JOIN shops sh ON s.shop_id = sh.shop_id
        WHERE s.customer_id = ?
    `;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching statements:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

//////////////////////SELLER SECTION //////////////////////

// Seller login route
app.post("/seller-login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const query = "SELECT * FROM sellers WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error during seller login:", err);
            return res
                .status(500)
                .json({ success: false, message: "Database query error" });
        }

        if (results.length > 0) {
            const seller = results[0];
            return res.json({
                success: true,
                shopID: seller.shop_id,
                sellerName: seller.seller_name,
                email: seller.email,
            });
        } else {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }
    });
});

// Fetch seller information by shop_id
app.get("/seller/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT shop_id,seller_name, email, phone_number, address, seller_image
        FROM Sellers
        WHERE shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching seller information:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Seller not found" });
        }
        res.json(results[0]);
    });
});

///// SET DISCOUNT PAGE

// // Fetch product categories
// app.get("/product-categories", (req, res) => {
//     const query = "SELECT * FROM product_category";
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error("Error fetching product categories:", err);
//             return res.status(500).json({ error: "Database query error" });
//         }
//         res.json(results);
//     });
// });

// Fetch products for a specific shop
app.get("/shop-products/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT DISTINCT p.product_id, p.title, p.category_id
        FROM shop_products sp
        JOIN products p ON sp.product_id = p.product_id
        WHERE sp.shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching shop products:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
        // console.log(results);
    });
});

// Set or update discount for a product
app.post("/set-discount", (req, res) => {
    const { shop_id, product_id, discountPercent } = req.body;

    // Check if a discount already exists for the given shop_id and product_id
    const checkQuery = `
        SELECT * FROM discountedProduct
        WHERE shop_id = ? AND product_id = ?
    `;
    db.query(checkQuery, [shop_id, product_id], (err, results) => {
        if (err) {
            console.error("Error checking existing discount:", err);
            return res.status(500).json({ error: "Database query error" });
        }

        if (results.length > 0) {
            // Update existing discount
            const updateQuery = `
                UPDATE discountedProduct
                SET discountPercent = ?
                WHERE shop_id = ? AND product_id = ?
            `;
            db.query(
                updateQuery,
                [discountPercent, shop_id, product_id],
                (err, results) => {
                    if (err) {
                        console.error("Error updating discount:", err);
                        return res
                            .status(500)
                            .json({ error: "Database query error" });
                    }
                    res.json({ message: "Discount updated successfully!" });
                }
            );
        } else {
            // Insert new discount
            const insertQuery = `
                INSERT INTO discountedProduct (shop_id, product_id, discountPercent)
                VALUES (?, ?, ?)
            `;
            db.query(
                insertQuery,
                [shop_id, product_id, discountPercent],
                (err, results) => {
                    if (err) {
                        console.error("Error setting discount:", err);
                        return res
                            .status(500)
                            .json({ error: "Database query error" });
                    }
                    res.json({ message: "Discount set successfully!" });
                }
            );
        }
    });
});

////////// Pending Orders
// Fetch pending orders for a specific shop
app.get("/pending-orders/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT * FROM orders
        WHERE shop_id = ? AND status = 'pending'
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching pending orders:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

//// Order DOne History
// Fetch order history for a specific shop
app.get("/order-history/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT * FROM orders
        WHERE shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching order history:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// HOMEPAGE OF SELLER
// Fetch pending order count for a specific shop
app.get("/pending-order-count/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT COUNT(*) AS count FROM orders
        WHERE shop_id = ? AND status = 'pending'
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching pending order count:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results[0]);
    });
});

//// Payment History of Seller by Shop ID

// Fetch due payments for a specific shop
app.get("/due-payments/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT dp.due_id, c.customer_name, dp.Amount, dp.due_date, dp.payment_status, dp.partial_payment_amount, dp.payment_reason
        FROM due_payment dp
        JOIN customers c ON dp.customer_id = c.customer_id
        WHERE dp.shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching due payments:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

//////// MESSAGING SYSTEM------------------------

// Fetch conversations for a specific customer
app.get("/customer-conversations/:customerId", (req, res) => {
    const { customerId } = req.params;
    const query = `
        SELECT DISTINCT s.shop_id, s.shop_name
        FROM messages m
        JOIN shops s ON m.shop_id = s.shop_id
        WHERE m.customer_id = ?
    `;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching conversations:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Fetch conversations for a specific shop
app.get("/conversations/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT DISTINCT c.customer_id, c.customer_name AS name
        FROM messages m
        JOIN customers c ON m.customer_id = c.customer_id
        WHERE m.shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching conversations:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Fetch messages for a specific conversation
app.get("/messages/:shopId/:customerId", (req, res) => {
    const { shopId, customerId } = req.params;
    const query = `
        SELECT * FROM messages
        WHERE shop_id = ? AND customer_id = ?
        ORDER BY timestamp ASC
    `;
    db.query(query, [shopId, customerId], (err, results) => {
        if (err) {
            console.error("Error fetching messages:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Send a new message
app.post("/messages", (req, res) => {
    const { shop_id, customer_id, sender, message } = req.body;
    const query = `
        INSERT INTO messages (shop_id, customer_id, sender, message)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [shop_id, customer_id, sender, message], (err, results) => {
        if (err) {
            console.error("Error sending message:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ message: "Message sent successfully!" });
    });
});

/// ADD PRODUCT
// Helper function to create a folder if it doesn't exist
const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`Folder created: ${folderPath}`);
        } catch (err) {
            console.error("Error creating folder:", err);
            throw new Error("Error creating folder");
        }
    } else {
        console.log(`Folder already exists: ${folderPath}`);
    }
};

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const categoryID = req.body.category_id;
        const query =
            "SELECT category_name FROM product_category WHERE category_id = ?";
        db.query(query, [categoryID], (err, results) => {
            if (err || results.length === 0) {
                console.error("Error fetching category name:", err);
                return cb(new Error("Invalid category ID"));
            }
            const categoryName = results[0].category_name;
            const categoryFolder = path.join(
                __dirname,
                "..",
                "projectimages",
                "products",
                categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
            );
            try {
                createFolderIfNotExists(categoryFolder);
                cb(null, categoryFolder);
            } catch (error) {
                cb(error);
            }
        });
    },
    filename: (req, file, cb) => {
        const random2Digit = Math.floor(10 + Math.random() * 90); // Generate a random 2-digit number
        const productTitle = req.body.title.replace(/\s+/g, "_"); // Replace spaces with underscores
        const filename = `${productTitle}_${random2Digit}${path.extname(
            file.originalname
        )}`;
        console.log(`Generated filename: ${filename}`);
        cb(null, filename);
    },
});
const upload = multer({ storage });

// Create a new product
app.post("/products", upload.single("image"), (req, res) => {
    const {
        category_id,
        title,
        price,
        brand,
        max_discountable_price,
        description,
        stock,
        shop_id,
    } = req.body;

    const query =
        "SELECT category_name FROM product_category WHERE category_id = ?";
    db.query(query, [category_id], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error fetching category name:", err);
            return res.status(400).json({ error: "Invalid category ID" });
        }
        const categoryName = results[0].category_name;
        const image_url = req.file
            ? path.join(
                  "projectimages",
                  "products",
                  categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                  req.file.filename
              )
            : null;

        const insertQuery =
            "INSERT INTO Products (category_id, title, price, brand, max_discountable_price, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(
            insertQuery,
            [
                category_id,
                title,
                price,
                brand,
                max_discountable_price,
                description,
                image_url,
            ],
            (err, results) => {
                if (err) {
                    console.error("Error creating product:", err);
                    return res
                        .status(500)
                        .json({ error: "Database query error" });
                }
                const product_id = results.insertId;

                // Add product to shop
                const shopProductQuery =
                    "INSERT INTO shop_products (shop_id, product_id, stock) VALUES (?, ?, ?)";
                db.query(
                    shopProductQuery,
                    [shop_id, product_id, stock],
                    (err, results) => {
                        if (err) {
                            console.error("Error adding product to shop:", err);
                            return res
                                .status(500)
                                .json({ error: "Database query error" });
                        }
                        res.json({
                            message:
                                "Product created and added to shop successfully!",
                            product_id,
                        });
                    }
                );
            }
        );
    });
});

// Add a product to a shop
app.post("/shop-products", (req, res) => {
    const { shop_id, product_id, stock } = req.body;
    const query =
        "INSERT INTO shop_products (shop_id, product_id, stock) VALUES (?, ?, ?)";
    db.query(query, [shop_id, product_id, stock], (err, results) => {
        if (err) {
            console.error("Error adding product to shop:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ message: "Product added to shop successfully!" });
    });
});

//// UPDATE?MODIFY SHOP PRODUCT-----------------------------------------
// Helper function to get category name
const getCategoryName = (category_id, callback) => {
    const query =
        "SELECT category_name FROM product_category WHERE category_id = ?";
    db.query(query, [category_id], (err, results) => {
        if (err || results.length === 0) {
            return callback(new Error("Invalid category ID"));
        }
        callback(null, results[0].category_name);
    });
};

// Fetch product details by product_id
app.get("/shop-products-by-id/:product_id", (req, res) => {
    const { product_id } = req.params;
    const query = `
        SELECT p.*, sp.stock 
        FROM Products p 
        JOIN shop_products sp ON p.product_id = sp.product_id 
        WHERE p.product_id = ?`;
    db.query(query, [product_id], (err, results) => {
        if (err) {
            console.error("Error fetching product details:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(results[0]);
    });
});

// Fetch all products for dropdown
app.get("/shop-products-update", (req, res) => {
    const query = `
        SELECT DISTINCT p.product_id, p.title 
        FROM Products p 
        JOIN shop_products sp ON p.product_id = sp.product_id`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Update product details
app.put("/products/:product_id", upload.single("image"), (req, res) => {
    const { product_id } = req.params;
    const {
        category_id,
        title,
        price,
        brand,
        max_discountable_price,
        description,
        stock,
        shop_id,
    } = req.body;

    const query = "SELECT category_name FROM product_category WHERE category_id = ?";
    db.query(query, [category_id], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error fetching category name:", err);
            return res.status(400).json({ error: "Invalid category ID" });
        }
        const categoryName = results[0].category_name;
        const image_url = req.file
            ? path.join(
                  "projectimages",
                  "products",
                  categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                  req.file.filename
              )
            : null;

        const updateQuery = `
            UPDATE Products 
            SET category_id = ?, title = ?, price = ?, brand = ?, max_discountable_price = ?, description = ?, image_url = ?
            WHERE product_id = ?`;
        db.query(
            updateQuery,
            [
                category_id,
                title,
                price,
                brand,
                max_discountable_price,
                description,
                image_url,
                product_id,
            ],
            (err, results) => {
                if (err) {
                    console.error("Error updating product:", err);
                    return res.status(500).json({ error: "Database query error" });
                }

                const updateStockQuery = `
                    UPDATE shop_products 
                    SET stock = ? 
                    WHERE shop_id = ? AND product_id = ?`;
                db.query(
                    updateStockQuery,
                    [stock, shop_id, product_id],
                    (err, results) => {
                        if (err) {
                            console.error("Error updating product stock:", err);
                            return res.status(500).json({ error: "Database query error" });
                        }
                        res.json({ message: "Product updated successfully!" });
                    }
                );
            }
        );
    });
});