// artillery-functions.js
import { spawn } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Exportar funciones con nombres específicos
export const demoNavigation = async (page, userContext, events) => {
  try {
    console.log("Ejecutando demo navigation...");
    await runPlaywrightTest(
      "demo.spec.ts",
      "can add a product to the cart",
      events,
      "demo.navigation"
    );
  } catch (error) {
    console.error("Demo navigation failed:", error);
    events.emit("counter", "demo.navigation.failed", 1);
  }
};

export const signInFlow = async (page, userContext, events) => {
  try {
    console.log("Ejecutando sign in flow...");
    await runPlaywrightTest(
      "demo.signin.spec.ts",
      "test",
      events,
      "signin.flow"
    );
  } catch (error) {
    console.error("Sign in flow failed:", error);
    events.emit("counter", "signin.flow.failed", 1);
  }
};

export const guestOrderFlow = async (page, userContext, events) => {
  try {
    console.log("Ejecutando guest order flow...");
    await runPlaywrightTest(
      "guest-create-order.spec.ts",
      "Guest can create an order",
      events,
      "guest.order"
    );
  } catch (error) {
    console.error("Guest order flow failed:", error);
    events.emit("counter", "guest.order.failed", 1);
  }
};

export const userOrderFlow = async (page, userContext, events) => {
  try {
    console.log("Ejecutando user order flow...");
    await runPlaywrightTest(
      "user-create-order.spec.ts",
      "User can create an order",
      events,
      "user.order"
    );
  } catch (error) {
    console.error("User order flow failed:", error);
    events.emit("counter", "user.order.failed", 1);
  }
};

// Función helper para ejecutar tests de Playwright
async function runPlaywrightTest(testFile, testGrep, events, eventName) {
  return new Promise((resolve, reject) => {
    const testPath = join(__dirname, "src/e2e", testFile);

    console.log(`Ejecutando: ${testPath} con grep: ${testGrep}`);

    const child = spawn(
      "npx",
      [
        "playwright",
        "test",
        testPath,
        "--grep",
        testGrep,
        "--reporter=json",
        "--workers=1",
        "--timeout=30000", // 30 segundos timeout
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, NODE_ENV: "test" },
      }
    );

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      console.log(`Test ${testFile} terminó con código: ${code}`);

      if (code === 0) {
        events.emit("counter", `${eventName}.completed`, 1);
        resolve(output);
      } else {
        events.emit("counter", `${eventName}.failed`, 1);
        console.error(`Test ${testFile} falló:`, errorOutput);
        reject(new Error(`Test failed with code ${code}`));
      }
    });

    child.on("error", (error) => {
      console.error(`Error ejecutando ${testFile}:`, error);
      events.emit("counter", `${eventName}.failed`, 1);
      reject(error);
    });
  });
}
