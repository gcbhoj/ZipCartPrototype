package ca.sheridancollege.capstoneprototype.service;


import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import ca.sheridancollege.bijumonk.beans.Cart;
import ca.sheridancollege.bijumonk.beans.CartItem;
import ca.sheridancollege.bijumonk.beans.Product;
import ca.sheridancollege.bijumonk.beans.Retailer;
import ca.sheridancollege.bijumonk.repositories.CartItemRepository;
import ca.sheridancollege.bijumonk.repositories.CartRepository;
import ca.sheridancollege.bijumonk.repositories.ProductRepository;
import ca.sheridancollege.bijumonk.repositories.RetailerRepository;
import ca.sheridancollege.bijumonk.request.AddCartItemRequestDTO;
import ca.sheridancollege.bijumonk.request.InitCartRequestDTO;
import ca.sheridancollege.bijumonk.response.AddCartItemResponseDTO;
import ca.sheridancollege.bijumonk.response.InitCartResponseDTO;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartService {

	private CartRepository cartRepository;
    private RetailerRepository retailerRepository;
    private ProductRepository productRepository;
    private CartItemRepository cartItemRepository;

    // ── Initialize Cart ──────────────────────────────────────────
    public InitCartResponseDTO initializeCart(InitCartRequestDTO request) {
        Long userId = Long.parseLong(request.getUserId());

        // ONE CART RULE
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        if (existingCart.isPresent() && existingCart.get().isActive()) {
            throw new RuntimeException("User already has an active cart. Close it before opening a new one.");
        }

        Retailer retailer = retailerRepository.findById(Long.parseLong(request.getRetailerId()))
                .orElseThrow(() -> new RuntimeException("Retailer not found: " + request.getRetailerId()));

        Long cartId = Math.abs(UUID.randomUUID().getMostSignificantBits());

        Cart cart = Cart.builder()
                .cartId(cartId)
                .userId(userId)
                .retailerId(Long.parseLong(request.getRetailerId()))
                .retailerName(retailer.getRetailerName())
                .budget(request.getBudget())
                .isActive(true)
                .build();

        cartRepository.save(cart);

        return InitCartResponseDTO.builder()
                .cartId(String.valueOf(cart.getCartId()))
                .retailerName(retailer.getRetailerName())
                .budget(cart.getBudget())
                .message("Cart initialized successfully")
                .build();
    }

    // ── Add Item to Cart ─────────────────────────────────────────
    public AddCartItemResponseDTO addItemToCart(AddCartItemRequestDTO request) {
        Long cartId = Long.parseLong(request.getCartId());
        Long prodId = Long.parseLong(request.getProdId());

        // Validate cart exists and is active
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed. Please open a new cart.");
        }

        // Get product
        Product product = productRepository.findById(prodId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + prodId));

        // Check budget
        Double totalItemCost = product.getPrice() * request.getQuantity();
        if (totalItemCost > cart.getBudget()) {
            throw new RuntimeException("Insufficient budget. Item costs $" + totalItemCost 
                + " but remaining budget is $" + cart.getBudget());
        }

        // Save cart item
        CartItem cartItem = CartItem.builder()
                .cartId(cartId)
                .prodId(prodId)
                .productName(product.getProductName())
                .price(product.getPrice())
                .quantity(request.getQuantity())
                .imageURL(product.getImageURL())
                .itemType(request.getItemType())
                .build();

        cartItemRepository.save(cartItem);

        // Deduct from budget
        Double remainingBudget = cart.getBudget() - totalItemCost;
        cart.setBudget(remainingBudget);
        cartRepository.save(cart);

        return AddCartItemResponseDTO.builder()
                .cartItemId(String.valueOf(cartItem.getCartItemId()))
                .productName(product.getProductName())
                .price(product.getPrice())
                .quantity(request.getQuantity())
                .itemType(request.getItemType())
                .remainingBudget(remainingBudget)
                .message("Item added to cart successfully")
                .build();
    }

    // ── Close Cart ───────────────────────────────────────────────
    public String closeCart(Long cartId, Long userId) {
        Cart cart = cartRepository.findByCartIdAndUserId(cartId, userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for this user."));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is already closed.");
        }

        cart.setActive(false);
        cartRepository.save(cart);
        return "Cart closed successfully.";
    }
}