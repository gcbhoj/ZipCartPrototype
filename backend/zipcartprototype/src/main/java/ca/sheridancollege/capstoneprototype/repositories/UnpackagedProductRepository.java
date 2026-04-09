package ca.sheridancollege.capstoneprototype.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.capstoneprototype.domain.UnpackagedProduct;

public interface UnpackagedProductRepository extends JpaRepository<UnpackagedProduct, Long> {
	
	Optional<UnpackagedProduct> findByNameIgnoreCase(String name);

}
