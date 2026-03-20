package ca.sheridancollege.capstoneprototype.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.bijumonk.beans.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

	Optional<Cart> findByUserId(Long userId);                          // one cart rule
    Optional<Cart> findByCartIdAndUserId(Long cartId, Long userId);		// close cart
}
