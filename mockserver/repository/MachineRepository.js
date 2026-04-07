import { readData } from "../utils/reader.js";
import fs from "node:fs/promises";

import path from "path";
import { fileURLToPath } from "url";
import { writeData } from "../utils/writer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/machines.json");

const getAll = async () => {
  const data = await readData(filePath);

  return data;
};

const getAllMachines = async () => {
  const machines = await getAll();

  // ✅ filter only active machines
  const activeMachines = machines.filter(
    (machine) => machine.isActive === true,
  );

  return activeMachines;
};

export { getAllMachines };
