package ca.sheridancollege.capstoneprototype.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import ca.sheridancollege.capstoneprototype.domain.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
	List<CartItem> findByCartId(Long cartId);
	
	@Query("SELECT c.prodId FROM CartItem c WHERE c.cartId = :cartId AND c.itemType = 'packaged'")
	List<Long> findPackagedProductIdsByCartId(Long cartId);

	@Query("SELECT c.prodId FROM CartItem c WHERE c.cartId = :cartId AND c.itemType = 'unpackaged'")
	List<Long> findUnpackagedProductIdsByCartId(Long cartId);
	
	List<CartItem> findByCartIdAndItemType(Long cartId, String itemType);
	
	CartItem findByProdId(Long prodId);
	
	CartItem findByCartIdAndProdId(Long cartId, Long prodId);
}
