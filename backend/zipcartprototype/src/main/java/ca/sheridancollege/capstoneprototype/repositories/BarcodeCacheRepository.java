package ca.sheridancollege.capstoneprototype.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.capstoneprototype.domain.BarcodeCache;

public interface BarcodeCacheRepository extends JpaRepository<BarcodeCache, Long> {

	Optional<BarcodeCache> findByBarcode(String barcode);
}
