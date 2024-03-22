const fs = require("fs");

function copyEnvironmentFile() {
  const branch = process.env.BRANCH_NAME || "main"; // You can replace 'main' with 'development' if needed
  console.log("=====================\n\nHELLO WORLD=================");
  let sourceFile, destinationFile;
  if (branch === "main") {
    sourceFile = ".prodenv";
  } else if (branch === "development") {
    sourceFile = ".devenv";
  } else {
    console.error("Unsupported branch:", branch);
    return;
  }

  const destinationEnvFile = ".env";

  // Check if .env file exists
  if (!fs.existsSync(destinationEnvFile)) {
    console.error(".env file does not exist.");
    return;
  }

  try {
    // Read content from source file
    const content = fs.readFileSync(sourceFile, "utf8");

    // Write content to destination file
    fs.writeFileSync(destinationEnvFile, content);

    console.log(`Environment file updated with ${sourceFile} content.`);
  } catch (error) {
    console.error("Error copying environment file:", error);
  }
}

copyEnvironmentFile();
