package ca.sheridancollege.capstoneprototype.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.capstoneprototype.domain.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	Optional<Product> findByBarcode(String barcode);
    Optional<Product> findByProductName(String productName);

}
