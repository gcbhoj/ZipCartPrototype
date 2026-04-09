package ca.sheridancollege.capstoneprototype.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.capstoneprototype.domain.PiData;

public interface PiDataRepository extends JpaRepository<PiData, Long> {

	PiData findTopByMachineIdOrderByTimestampDesc(String machineId);
	
	PiData findByMachineId(String machineId);
}
