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

// SIGN UP PAGE------------------------------------

// // Add customer registration endpoint
// Multer setup for image uploads
const storage_SC = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "projectimages", "Customer")); // Save image to the correct folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filename
    },
});

const upload_SC = multer({ storage: storage_SC });

// Endpoint to handle customer registration and image upload
app.post("/customer/register", upload_SC.single("image"), (req, res) => {
    const { customer_name, email, username, password, phone_number, address } =
        req.body;
    const customer_level = 2; // Hardcoded customer level
    const query = `
        INSERT INTO Customers (customer_level, customer_name, email, username, password, phone_number, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

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
        ],
        (err, results) => {
            if (err) {
                console.error("Error registering customer:", err);
                return res.status(500).json({ error: "Database query error" });
            }

            const customerId = results.insertId;
            const tempImagePath = req.file.path;
            const targetImagePath = `projectimages/Customer/${customerId}.jpg`;

            // Move the image to the target directory
            fs.rename(
                tempImagePath,
                path.join(
                    __dirname,
                    "..",
                    "projectimages",
                    "Customer",
                    `${customerId}.jpg`
                ),
                (err) => {
                    if (err) {
                        console.error("Error moving image:", err);
                        return res
                            .status(500)
                            .json({ error: "Error moving image" });
                    }

                    // Update the customer record with the image path
                    const updateQuery = `
                    UPDATE Customers
                    SET customer_image = ?
                    WHERE customer_id = ?
                `;
                    db.query(
                        updateQuery,
                        [targetImagePath, customerId],
                        (err) => {
                            if (err) {
                                console.error(
                                    "Error updating customer image path:",
                                    err
                                );
                                return res
                                    .status(500)
                                    .json({ error: "Database query error" });
                            }

                            res.json({
                                success: true,
                                customer_id: customerId,
                                imageUrl: targetImagePath,
                            });
                        }
                    );
                }
            );
        }
    );
});

// Seller part

// Ensure the temporary upload directory exists
const tempUploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}

// Multer setup for seller image uploads
const storage_SS = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempUploadDir); // Temporary upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload_SS = multer({ storage: storage_SS });

// Endpoint to handle seller registration and image upload
app.post("/seller/register", upload_SS.single("image"), (req, res) => {
    const { username, password, seller_name, email, phone_number, address } =
        req.body;

    if (!username || !password || !seller_name || !email) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    // Insert seller data into the database
    const query = `
        INSERT INTO Sellers 
        (username, password, seller_name, email, phone_number, address)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [username, password, seller_name, email, phone_number, address],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res
                    .status(500)
                    .json({ error: "Error inserting seller data." });
            }

            const shopId = results.insertId;
            const tempImagePath = req.file ? req.file.path : null;

            if (tempImagePath) {
                const targetDir = path.join(
                    __dirname,
                    "../projectimages/Seller"
                );
                const targetImagePath = path.join(targetDir, `${shopId}.jpg`);

                // Create the target directory if it doesn't exist
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }

                // Rename the temporary file to the shop ID
                fs.rename(tempImagePath, targetImagePath, (err) => {
                    if (err) {
                        console.error("Error renaming image:", err);
                        return res
                            .status(500)
                            .json({ error: "Error saving seller image." });
                    }

                    // Update the seller's image path in the database
                    const updateQuery = `
                        UPDATE Sellers 
                        SET seller_image = ? 
                        WHERE shop_id = ?
                    `;
                    db.query(
                        updateQuery,
                        [
                            path.join("projectimages/Seller", `${shopId}.jpg`),
                            shopId,
                        ],
                        (err) => {
                            if (err) {
                                console.error(
                                    "Error updating image path:",
                                    err
                                );
                                return res.status(500).json({
                                    error: "Error updating seller image path.",
                                });
                            }

                            res.status(201).json({
                                message: "Seller registered successfully.",
                                shopId,
                            });
                        }
                    );
                });
            } else {
                res.status(201).json({
                    message: "Seller registered successfully without an image.",
                    shopId,
                });
            }
        }
    );
});

// Endpoint to get shop details by shop ID
app.get("/create-shop/:shopID", (req, res) => {
    const { shopID } = req.params;
    console.log(`Fetching details for shop ID: ${shopID}`);

    const query = `
        SELECT shop_name, shop_image, area_code, area_name, full_address, shop_rating
        FROM Shops
        WHERE shop_id = ?
    `;

    db.query(query, [shopID], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res
                .status(500)
                .json({ error: "Error fetching shop details." });
        }

        if (results.length === 0) {
            console.log(`Shop not found for ID: ${shopID}`);
            return res.status(404).json({ error: "Shop not found." });
        }

        console.log(`Shop details fetched successfully for ID: ${shopID}`);
        res.status(200).json(results[0]);
    });
});

// Create Shop
const storage_SH = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempUploadDir); // Temporary upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload_SH = multer({ storage: storage_SH });

app.post("/shop/register", upload_SH.single("image"), (req, res) => {
    const { shop_name, area_code, area_name, full_address, shop_id } = req.body;

    if (!shop_name || !shop_id) {
        return res
            .status(400)
            .json({ error: "Shop name and shop ID are required." });
    }

    const checkShopQuery = `SELECT shop_id FROM Sellers WHERE shop_id = ?`;
    db.query(checkShopQuery, [shop_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error checking shop ID." });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "Shop ID does not exist." });
        }

        const query = `
            INSERT INTO Shops 
            (shop_name, area_code, area_name, full_address, shop_id)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [shop_name, area_code, area_name, full_address, shop_id],
            (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return res
                        .status(500)
                        .json({ error: "Error inserting shop data." });
                }

                const tempImagePath = req.file ? req.file.path : null;

                if (tempImagePath) {
                    const targetDir = path.join(
                        __dirname,
                        "../projectimages/shops"
                    );
                    const targetImagePath = path.join(
                        targetDir,
                        `${shop_id}.jpg`
                    );

                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }

                    fs.rename(tempImagePath, targetImagePath, (err) => {
                        if (err) {
                            console.error("Error renaming image:", err);
                            return res
                                .status(500)
                                .json({ error: "Error saving shop image." });
                        }

                        const updateQuery = `UPDATE Shops SET shop_image = ? WHERE shop_id = ?`;
                        db.query(
                            updateQuery,
                            [
                                path.join(
                                    "projectimages/shops",
                                    `${shop_id}.jpg`
                                ),
                                shop_id,
                            ],
                            (err) => {
                                if (err) {
                                    console.error(
                                        "Error updating image path:",
                                        err
                                    );
                                    return res.status(500).json({
                                        error: "Error updating shop image path.",
                                    });
                                }

                                console.log(
                                    "Shop registered successfully with image."
                                );
                                res.status(201).json({
                                    message: "Shop registered successfully.",
                                    shop_id,
                                });
                            }
                        );
                    });
                } else {
                    console.log(
                        "Shop registered successfully without an image."
                    );
                    res.status(201).json({
                        message:
                            "Shop registered successfully without an image.",
                        shop_id,
                    });
                }
            }
        );
    });
});

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

// Customer Home
app.get("/customer-info", (req, res) => {
    const customerId = req.query.customer_id;
    const query = `
        SELECT customer_id, customer_level, customer_name, customer_image
        FROM Customers
        WHERE customer_id = ?`;
    db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error("Error fetching customer info:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results[0]);
    });
});

app.get("/chome-discounted-products", (req, res) => {
    const query = `
        SELECT dp.discount_id, dp.discountPercent, p.product_id, p.title, p.image_url
        FROM discountedProduct dp
        JOIN products p ON dp.product_id = p.product_id
        JOIN shops s ON dp.shop_id = s.shop_id
        ORDER BY dp.discountPercent DESC
        LIMIT 5`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching discounted products:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
}); // QQ

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

// WITHOUT LOGIN PAGE -> HOME

// Search products by title
app.get("/search-products", (req, res) => {
    const { title } = req.query;
    const query = `
        SELECT * FROM Products WHERE title LIKE ?
    `;
    db.query(query, [`%${title}%`], (err, result) => {
        if (err) {
            console.error("Error searching products:", err);
            res.status(500).send("Error searching products");
        } else {
            res.json(result);
        }
    });
});

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


app.get("/discounted-products", (req, res) => {
    const query = `
        SELECT dp.discount_id, dp.discountPercent, p.product_id, p.title, p.image_url
        FROM discountedProduct dp
        JOIN products p ON dp.product_id = p.product_id
        JOIN shops s ON dp.shop_id = s.shop_id
        ORDER BY dp.discountPercent DESC
        LIMIT 5`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching discounted products:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
}); // QQ

app.get("/free-delivery-products", (req, res) => {
    const query = `
        SELECT fd.fd, fd.status, p.product_id, p.title, p.image_url, p.price
        FROM freeDelivery fd
        JOIN products p ON fd.product_id = p.product_id
        WHERE fd.status = 'yes'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching free delivery products:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
    });
});

// EDIT Profile

app.use(
    "/projectimages",
    express.static(path.join(__dirname, "..", "projectimages"))
);

// Configure multer for file uploads
const storageC = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use path.join to navigate one level up from the backend directory to the main folder
        const dir = path.join(__dirname, "..", "projectimages", "Customer");

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir); // Set the destination directory
    },
    filename: (req, file, cb) => {
        const customerId = req.body.customer_id; // Retrieve customer ID from the request body
        cb(null, `${customerId}.jpg`); // Save the file as <customer_id>.jpg
    },
});

const uploadC = multer({ storage: storageC }); // Pass the corrected storage object

// Endpoint to handle file uploads
app.post("/cprofile-upload", uploadC.single("customer_image"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    // Construct the relative file path
    const relativeFilePath = path.join(
        "projectimages",
        "Customer",
        `${req.body.customer_id}.jpg`
    );

    res.status(200).json({
        message: "File uploaded successfully.",
        imagePath: relativeFilePath, // This is the relative path
    });
});

// CUSTOMER PROFILE PAGE

// CusNav search
// Endpoint to perform search
// app.get("/cusnav-search", (req, res) => {
//     const { query, category } = req.query;
//     let searchQuery = `
//         SELECT p.*, sp.shop_id
//         FROM products p
//         JOIN shop_products sp ON p.product_id = sp.product_id
//         WHERE p.title LIKE ? OR p.description LIKE ?
//     `;
//     const params = [`%${query}%`, `%${query}%`];

//     if (category) {
//         searchQuery += " AND p.category_id = (SELECT category_id FROM product_category WHERE category_name = ?)";
//         params.push(category);
//     }

//     db.query(searchQuery, params, (err, results) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ error: "Error performing search." });
//         }
//         res.status(200).json(results);
//     });
// });
app.get("/cusnav-search", (req, res) => {
    const { query } = req.query;

    // Query to search products and match categories
    const productSearchQuery = `
        SELECT p.*, sp.shop_id 
        FROM products p
        JOIN shop_products sp ON p.product_id = sp.product_id
        WHERE p.title LIKE ? OR p.description LIKE ?
    `;

    const categorySearchQuery = `
        SELECT p.*, sp.shop_id 
        FROM products p
        JOIN shop_products sp ON p.product_id = sp.product_id
        WHERE p.category_id = (
            SELECT category_id 
            FROM product_category 
            WHERE category_name LIKE ?
        )
    `; // QQ

    const productSearchParams = [`%${query}%`, `%${query}%`];
    const categorySearchParams = [`%${query}%`];

    // Execute both queries and combine results
    db.query(productSearchQuery, productSearchParams, (err, productResults) => {
        if (err) {
            console.error("Database error:", err);
            return res
                .status(500)
                .json({ error: "Error performing product search." });
        }

        db.query(
            categorySearchQuery,
            categorySearchParams,
            (err, categoryResults) => {
                if (err) {
                    console.error("Database error:", err);
                    return res
                        .status(500)
                        .json({ error: "Error performing category search." });
                }

                // Combine and remove duplicates
                const combinedResults = [...productResults, ...categoryResults];
                const uniqueResults = Array.from(
                    new Map(
                        combinedResults.map((item) => [item.product_id, item])
                    ).values()
                );

                res.status(200).json(uniqueResults);
            }
        );
    });
});

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
}); // QQ

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

// Update order status
app.put("/update-order-status", (req, res) => {
    const { order_id, status } = req.body;
    const query = `
        UPDATE orders
        SET status = ?
        WHERE order_id = ?
    `;
    db.query(query, [status, order_id], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            res.status(500).json({ message: "Error updating order status" });
            return;
        }
        res.status(200).json({ message: "Order status updated successfully" });
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

// Fetch total sales amount for a shop
app.get("/total-sales/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT SUM(Amount) AS total_sales
        FROM due_payment
        WHERE shop_id = ? AND payment_status = 'paid'
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching total sales amount:", err);
            res.status(500).json({
                message: "Error fetching total sales amount",
            });
            return;
        }
        res.json({ total_sales: results[0].total_sales });
    });
});

// Fetch reports for seller home based on shop_id
app.get("/sellerhome-reports", (req, res) => {
    const { shop_id } = req.query; // Assuming shop_id is passed as a query parameter
    const query = `
        SELECT r.*, dp.shop_id
        FROM Report r
        JOIN due_payment dp ON r.due_id = dp.due_id
        WHERE dp.shop_id = ?
    `;
    db.query(query, [shop_id], (err, results) => {
        if (err) {
            console.error("Error fetching reports:", err);
            res.status(500).json({ message: "Error fetching reports" });
            return;
        }
        res.json(results);
    });
});

// Fetch top 5 discounted products for a shop
app.get("/top-discounted-products", (req, res) => {
    const { shop_id } = req.query; // Assuming shop_id is passed as a query parameter
    const query = `
        SELECT dp.*, p.title
        FROM discountedProduct dp
        JOIN products p ON dp.product_id = p.product_id
        WHERE dp.shop_id = ?
        ORDER BY dp.discountPercent DESC
        LIMIT 5
    `;
    //QQ
    db.query(query, [shop_id], (err, results) => {
        if (err) {
            console.error("Error fetching discounted products:", err);
            res.status(500).json({
                message: "Error fetching discounted products",
            });
            return;
        }
        res.json(results);
    });
});

// Fetch top 5 low stock products for a shop
app.get("/low-stock-products", (req, res) => {
    const { shop_id } = req.query; // Assuming shop_id is passed as a query parameter
    const query = `
        SELECT sp.*, p.title AS title
        FROM shop_products sp
        JOIN products p ON sp.product_id = p.product_id
        WHERE sp.shop_id = ?
        ORDER BY sp.stock ASC
        LIMIT 5
    `;
    db.query(query, [shop_id], (err, results) => {
        if (err) {
            console.error("Error fetching low stock products:", err);
            res.status(500).json({
                message: "Error fetching low stock products",
            });
            return;
        }
        res.json(results);
    });
});

// Fetch count of low stock products for a shop
app.get("/low-stock-count/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT COUNT(*) AS low_stock_count
        FROM shop_products
        WHERE shop_id = ? AND stock < 10
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching low stock count:", err);
            res.status(500).json({ message: "Error fetching low stock count" });
            return;
        }
        res.json({ low_stock_count: results[0].low_stock_count });
    });
});

// Fetch top discount for a shop
app.get("/top-discount/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT MAX(discountPercent) AS top_discount
        FROM discountedProduct
        WHERE shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching top discount:", err);
            res.status(500).json({ message: "Error fetching top discount" });
            return;
        }
        res.json({ top_discount: results[0].top_discount });
    });
});

// Fetch total messages for a shop
app.get("/total-messages/:shopId", (req, res) => {
    const { shopId } = req.params;
    const query = `
        SELECT COUNT(*) AS total_messages
        FROM messages
        WHERE shop_id = ?
    `;
    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error("Error fetching total messages:", err);
            res.status(500).json({ message: "Error fetching total messages" });
            return;
        }
        res.json({ total_messages: results[0].total_messages });
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
// app.get("/shop-products-update", (req, res) => {
//     const query = `
//         SELECT DISTINCT p.product_id, p.title 
//         FROM Products p 
//         JOIN shop_products sp ON p.product_id = sp.product_id`;
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error("Error fetching products:", err);
//             return res.status(500).json({ error: "Database query error" });
//         }
//         res.json(results);
//     });
// });

// Fetch products for a specific shop
app.get("/shop-products-update", (req, res) => {
    const { shop_id } = req.query;
    const query = `
        SELECT DISTINCT p.product_id, p.title 
        FROM Products p 
        JOIN shop_products sp ON p.product_id = sp.product_id
        WHERE sp.shop_id = ?
    `;
    db.query(query, [shop_id], (err, results) => {
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
                    return res
                        .status(500)
                        .json({ error: "Database query error" });
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
                            return res
                                .status(500)
                                .json({ error: "Database query error" });
                        }
                        res.json({ message: "Product updated successfully!" });
                    }
                );
            }
        );
    });
});

/// -------------------------------------------------

// Add item to Cart
// Fetch customer info
app.get("/customer/:id", (req, res) => {
    const customerId = req.params.id;
    db.query(
        "SELECT * FROM Customers WHERE customer_id = ?",
        [customerId],
        (err, result) => {
            if (err) {
                console.error("Error fetching customer info:", err);
                res.status(500).send("Error fetching customer info");
            } else {
                res.json(result[0]);
            }
        }
    );
});

// Fetch shop info
app.get("/shop/:id", (req, res) => {
    const shopId = req.params.id;
    db.query(
        "SELECT * FROM Shops WHERE shop_id = ?",
        [shopId],
        (err, result) => {
            if (err) {
                console.error("Error fetching shop info:", err);
                res.status(500).send("Error fetching shop info");
            } else {
                res.json(result[0]);
            }
        }
    );
});

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

// Fetch delivery status for products
app.get("/deliveryStatus/:productId", (req, res) => {
    const productId = req.params.productId;
    const query = `
        SELECT status FROM freeDelivery WHERE product_id = ?
    `;
    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error("Error fetching delivery status:", err);
            res.status(500).send("Error fetching delivery status");
        } else {
            res.json(result[0]);
        }
    });
});

// Customer Checkout
// Fetch customer info for payment
app.get("/cusPay/fetch/:id", (req, res) => {
    const customerId = req.params.id;
    db.query(
        "SELECT * FROM Customers WHERE customer_id = ?",
        [customerId],
        (err, result) => {
            if (err) {
                console.error("Error fetching customer info:", err);
                res.status(500).send("Error fetching customer info");
            } else {
                res.json(result[0]);
            }
        }
    );
});

// Fetch shop IDs for products
app.get("/shopProducts/:productId", (req, res) => {
    const productId = req.params.productId;
    const query = `
        SELECT shop_id FROM shop_products WHERE product_id = ?
    `;
    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error("Error fetching shop ID for product:", err);
            res.status(500).send("Error fetching shop ID for product");
        } else {
            res.json(result[0]);
        }
    });
});

// Create a new order
app.post("/orders", (req, res) => {
    const { shop_id, customer_id, total_price, status } = req.body;
    const query = `
        INSERT INTO orders (shop_id, customer_id, total_price, status)
        VALUES (?, ?, ?, ?)
    `;
    db.query(
        query,
        [shop_id, customer_id, total_price, status],
        (err, result) => {
            if (err) {
                console.error("Error creating order:", err);
                res.status(500).send("Error creating order");
            } else {
                res.json({ order_id: result.insertId });
            }
        }
    );
});

// Create a new due payment
app.post("/duePayment", (req, res) => {
    const {
        shop_id,
        customer_id,
        amount,
        due_date,
        payment_reason,
        payment_status,
    } = req.body;
    const query = `
        INSERT INTO due_payment (shop_id, customer_id, amount, due_date, payment_status, payment_reason)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
        query,
        [
            shop_id,
            customer_id,
            amount,
            due_date,
            payment_status,
            payment_reason,
        ],
        (err, result) => {
            if (err) {
                console.error("Error creating due payment:", err);
                res.status(500).send("Error creating due payment");
            } else {
                res.json({ due_id: result.insertId });
            }
        }
    );
});

// Create order items
app.post("/orderItems", (req, res) => {
    const { order_id, items } = req.body;
    const query = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ?
    `;
    const values = items.map((item) => [
        order_id,
        item.product_id,
        item.quantity,
        item.price,
    ]);
    db.query(query, [values], (err, result) => {
        if (err) {
            console.error("Error creating order items:", err);
            res.status(500).send("Error creating order items");
        } else {
            res.json({ message: "Order items created successfully" });
        }
    });
});

// Create a new statement
app.post("/statements", (req, res) => {
    const { customer_id, shop_id, order_id } = req.body;
    const query = `
        INSERT INTO statement (customer_id, shop_id, order_id)
        VALUES (?, ?, ?)
    `;
    db.query(query, [customer_id, shop_id, order_id], (err, result) => {
        if (err) {
            console.error("Error creating statement:", err);
            res.status(500).send("Error creating statement");
        } else {
            res.json({ statement_id: result.insertId });
        }
    });
});

// Clear cart for a specific customer
app.delete("/clearCart/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    const query = `
        DELETE FROM Cart WHERE customer_id = ?
    `;
    db.query(query, [customerId], (err, result) => {
        if (err) {
            console.error("Error clearing cart:", err);
            res.status(500).send("Error clearing cart");
        } else {
            res.json({ message: "Cart cleared successfully" });
        }
    });
});

app.get("/customer/:customerID/due-payments", (req, res) => {
    const customerID = req.params.customerID;
    const query = `
        SELECT dp.*, s.shop_name
        FROM due_payment dp
        JOIN shops s ON dp.shop_id = s.shop_id
        WHERE dp.customer_id = ?
    `;
    db.query(query, [customerID], (err, results) => {
        if (err) {
            console.error("Error fetching due payments:", err);
            res.status(500).json({ message: "Error fetching due payments" });
            return;
        }
        res.json(results);
    });
});

// Handle due payment update
app.post("/update-duePayment", (req, res) => {
    const { due_id, amount, payment_status } = req.body;
    const partial_payment_amount = payment_status === "partial" ? amount : 0;
    const query = `
        UPDATE due_payment
        SET payment_status = ?, partial_payment_amount = ?
        WHERE due_id = ?
    `;
    db.query(
        query,
        [payment_status, partial_payment_amount, due_id],
        (err, result) => {
            if (err) {
                console.error("Error updating due payment:", err);
                res.status(500).json({ message: "Error updating due payment" });
                return;
            }
            res.status(200).json({ message: "Payment updated successfully" });
        }
    );
});

// Handle report submission
app.post("/report", (req, res) => {
    const { due_id, reported_by, report_reason } = req.body;
    const query = `
        INSERT INTO Report (due_id, reported_by, report_reason)
        VALUES (?, ?, ?)
    `;
    db.query(query, [due_id, reported_by, report_reason], (err, result) => {
        if (err) {
            console.error("Error submitting report:", err);
            res.status(500).json({ message: "Error submitting report" });
            return;
        }
        res.status(201).json({ message: "Report submitted successfully" });
    });
});
