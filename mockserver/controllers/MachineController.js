import { retrieveAllMachines } from "../services/MachineServices.js";

const fetchAllMachines = async (req, res) => {
  try {
    const machines = await retrieveAllMachines();

    if (!machines) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json(machines);
  } catch (error) {
    switch (error) {
      case "NO MACHINES AVAILABLE AT THE MOVEMENT":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

export { fetchAllMachines };
