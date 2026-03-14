require("dotenv").config();

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");

const app = express();

app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

const API_KEY = process.env.HIVE_API_KEY;

app.post("/detect", upload.single("file"), async (req, res) => {

    try {

        const form = new FormData();
        form.append("image", fs.createReadStream(req.file.path));

        const response = await axios.post(
            "https://api.thehive.ai/api/v2/task/sync",
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Token ${API_KEY}`
                }
            }
        );

        const result = response.data;

        const classes = result?.status?.output?.[0]?.classes;

        let aiScore = 0;

        classes.forEach(c => {
            if (c.class.includes("ai_generated")) {
                aiScore = c.score;
            }
        });

        const aiPercent = Math.round(aiScore * 100);
        const realPercent = 100 - aiPercent;

        fs.unlinkSync(req.file.path);

        res.json({
            ai_generated: aiPercent,
            real: realPercent
        });

    } catch (error) {
        res.status(500).json({
            error: "Detection failed",
            details: error.message
        });
    }

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});