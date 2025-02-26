const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  const ollama = spawn("ollama", ["run", "mistral"], { shell: true });

  ollama.stdin.write(userMessage + "\n"); // sends userMessage to the AI model
  ollama.stdin.end(); // tells the AI model that input is complete

  let aiResponse = "";
  ollama.stdout.on("data", (data) => {
    aiResponse += data.toString();
  });

  ollama.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  ollama.on("close", () => {
    res.json({ response: aiResponse.trim() });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
