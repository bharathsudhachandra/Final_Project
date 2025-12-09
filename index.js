const http = require("http");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://beprudhvi:prudhvi12@cluster0.pan3cyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const baseDir = path.join(__dirname, "Portfolio");

const server = http.createServer(async (req, res) => {

    if (req.url === "/api") {
        try {
            const client = new MongoClient(uri);
            await client.connect();
            const jobs = await client.db("job_portal").collection("jobs").find({}).sort({ id: 1 }).toArray();
            await client.close();
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify(jobs));
        } catch (error) {
            console.error("Error fetching data:", error);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("<h1>Internal Server Error</h1>");
        }
    } 

    else if (req.url === "/" || req.url === "/index.html") {
        // Serve the index.html file
        fs.readFile(path.join(__dirname,"Portfolio","index.html"), (err, content) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("<h1>Internal Server Error</h1>");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content);
        });
    }

    else if (req.url.startsWith("/")) {
        const filePath = path.join(baseDir, req.url);
        const ext = path.extname(filePath);
        const contentType = {
            ".css": "text/css",
            ".js": "application/javascript",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
        }[ext] || "application/octet-stream";

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 - File Not Found</h1>");
                return;
            }
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        });
    }
 
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

// Use an environment variable for the port, defaulting to 5960
const PORT = process.env.PORT || 5767;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
