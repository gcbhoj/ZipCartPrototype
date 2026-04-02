import MachineProfile from "../models/MachineProfile.js";
import { getAllMachines } from "../repository/MachineRepository.js";

const retrieveAllMachines = async () => {
  const machines = await getAllMachines();

  if (!machines) {
    throw new Error("NO MACHINES AVAILABLE AT THE MOVEMENT ");
  }

  const profile = machines.map((machine) => {
    return new MachineProfile(machine.machineId, machine.machineLocation);
  });

  return profile;
};

export { retrieveAllMachines };
