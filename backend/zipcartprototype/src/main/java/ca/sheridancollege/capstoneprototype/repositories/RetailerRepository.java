package ca.sheridancollege.capstoneprototype.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.capstoneprototype.domain.Retailer;

public interface RetailerRepository extends JpaRepository<Retailer, Long> {

}
