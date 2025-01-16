const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8081;

app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL connection
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

// Fetch all customers (for testing purposes)
app.get("/customers", (req, res) => {
    db.query("SELECT * FROM customers", (err, results) => {
        if (err) {
            console.error("Error fetching customers:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
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
                sellerID: seller.seller_id,
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Create a new product
app.post("/products", (req, res) => {
    const {
        category,
        title,
        price,
        stock_quantity,
        brand,
        max_discountable_price,
        description,
        image_url,
    } = req.body;
    const query =
        "INSERT INTO Products (category, title, price, stock_quantity, brand, max_discountable_price, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
        query,
        [
            category,
            title,
            price,
            stock_quantity,
            brand,
            max_discountable_price,
            description,
            image_url,
        ],
        (err, results) => {
            if (err) {
                console.error("Error creating product:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json({ success: true, product_id: results.insertId });
        }
    );
});

// Fetch all products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM Products", (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// Fetch a single product by ID
app.get("/products/:product_id", (req, res) => {
    const { product_id } = req.params;
    const query = "SELECT * FROM Products WHERE product_id = ?";
    db.query(query, [product_id], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    });
});

// Update a product by ID
app.put("/products/:product_id", (req, res) => {
    const { product_id } = req.params;
    const {
        category,
        title,
        price,
        stock_quantity,
        brand,
        max_discountable_price,
        description,
        image_url,
    } = req.body;
    const query =
        "UPDATE Products SET category = ?, title = ?, price = ?, stock_quantity = ?, brand = ?, max_discountable_price = ?, description = ?, image_url = ? WHERE product_id = ?";
    db.query(
        query,
        [
            category,
            title,
            price,
            stock_quantity,
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
            res.json({
                success: true,
                message: "Product updated successfully",
            });
        }
    );
});

// Delete a product by ID
app.delete("/products/:product_id", (req, res) => {
    const { product_id } = req.params;
    const query = "DELETE FROM Products WHERE product_id = ?";
    db.query(query, [product_id], (err, results) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json({ success: true, message: "Product deleted successfully" });
    });
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
        SELECT dp.due_id, s.shop_name, dp.due_date, dp.payment_status, dp.Amount
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

// Fetch favourite shops for a specific customer
app.get("/customer/:customerId/favourite-shops", (req, res) => {
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
        res.json(results.map(result => result.month));
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