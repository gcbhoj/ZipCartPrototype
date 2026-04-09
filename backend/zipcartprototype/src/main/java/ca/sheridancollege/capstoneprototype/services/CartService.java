package ca.sheridancollege.capstoneprototype.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import ca.sheridancollege.capstoneprototype.domain.Cart;
import ca.sheridancollege.capstoneprototype.domain.CartItem;
import ca.sheridancollege.capstoneprototype.domain.PiData;
import ca.sheridancollege.capstoneprototype.domain.Product;
import ca.sheridancollege.capstoneprototype.domain.Retailer;
import ca.sheridancollege.capstoneprototype.domain.UnpackagedProduct;
import ca.sheridancollege.capstoneprototype.repositories.CartItemRepository;
import ca.sheridancollege.capstoneprototype.repositories.CartRepository;
import ca.sheridancollege.capstoneprototype.repositories.PiDataRepository;
import ca.sheridancollege.capstoneprototype.repositories.ProductRepository;
import ca.sheridancollege.capstoneprototype.repositories.RetailerRepository;
import ca.sheridancollege.capstoneprototype.repositories.UnpackagedProductRepository;
import ca.sheridancollege.capstoneprototype.request.AddPackagedRequestDTO;
import ca.sheridancollege.capstoneprototype.request.AddUnpackagedCartItemRequestDTO;
import ca.sheridancollege.capstoneprototype.request.InitCartRequestDTO;
import ca.sheridancollege.capstoneprototype.request.RemoveCartItemRequestDTO;
import ca.sheridancollege.capstoneprototype.request.UpdateQuantityRequestDTO;
import ca.sheridancollege.capstoneprototype.response.AddPackagedResponseDTO;
import ca.sheridancollege.capstoneprototype.response.AddUnpackagedProductResponseDTO;
import ca.sheridancollege.capstoneprototype.response.CartItemViewDTO;
import ca.sheridancollege.capstoneprototype.response.CartSummaryResponseDTO;
import ca.sheridancollege.capstoneprototype.response.InitCartResponseDTO;
import ca.sheridancollege.capstoneprototype.response.PackagedProductDTO;
import ca.sheridancollege.capstoneprototype.response.RemoveCartItemResponseDTO;
import ca.sheridancollege.capstoneprototype.response.UnPackagedProductDTO;
import ca.sheridancollege.capstoneprototype.response.UpdateQuantityResponseDTO;
import ca.sheridancollege.capstoneprototype.response.ViewCartResponseDTO;
import ca.sheridancollege.capstoneprototype.response.WeightResponseDTO;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartService {

    private CartRepository cartRepository;
    private RetailerRepository retailerRepository;
    private ProductRepository productRepository;
    private CartItemRepository cartItemRepository;
    private UnpackagedProductRepository unpackagedProductRepository;
    private PiDataRepository piDataRepository;
    private MLService mlService;
    private final QRCodeService qrCodeService;
    // ── Initialize Cart ──────────────────────────────────────────────────────
    public InitCartResponseDTO initializeCart(InitCartRequestDTO request) {
        Long userId = Long.parseLong(request.getUserId());

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
    
    // - View cart By Id
    public ViewCartResponseDTO viewCartById(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed. Please open a new cart.");
        }

        // ── Packaged items ────────────────────────────────────
        List<CartItem> allPackagedItems = cartItemRepository
                .findByCartIdAndItemType(cartId, "packaged");

        List<PackagedProductDTO> packagedProductsList = allPackagedItems.stream()
                .map((CartItem item) -> PackagedProductDTO.builder()
                        .prodId(item.getProdId())
                        .productName(item.getProductName())
                        .imageURL(item.getImageURL())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        // ── Unpackaged items ──────────────────────────────────
        List<CartItem> allUnPackagedItems = cartItemRepository
                .findByCartIdAndItemType(cartId, "unpackaged");

        List<UnPackagedProductDTO> unPackagedProductsList = allUnPackagedItems.stream()
                .map((CartItem item) -> UnPackagedProductDTO.builder()
                        .prodId(item.getProdId())
                        .productName(item.getProductName())
                        .imageURL(item.getImageURL())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        // ── Calculate totals ──────────────────────────────────
        double packagedTotal = 0.0;
        for (CartItem item : allPackagedItems) {
            packagedTotal += item.getPrice() * item.getQuantity();
        }
        double cartTotalHst = packagedTotal * 0.13;

        double unPackagedTotal = 0.0;
        for (CartItem item : allUnPackagedItems) {
            String name = item.getProductName();
            UnpackagedProduct product = unpackagedProductRepository
                    .findByNameIgnoreCase(name)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + name));

            if (product.getPricingType().equalsIgnoreCase("count")) {
                unPackagedTotal += product.getPricePerCount() * item.getQuantity();
            } else {
                unPackagedTotal += item.getPrice();
            }
        }

        double cartTotal = packagedTotal + unPackagedTotal + cartTotalHst;

        return ViewCartResponseDTO.builder()
                .cartId(String.valueOf(cartId))
                .userId(String.valueOf(cart.getUserId()))
                .packagedProducts(packagedProductsList)
                .unpackagedProducts(unPackagedProductsList)
                .hst(cartTotalHst)
                .total(cartTotal)
                .build();
    }
    
    
    
    
    
    

    // ── Add Packaged Item to Cart ────────────────────────────────────────────
    public AddPackagedResponseDTO addPacakagedItemToCart(AddPackagedRequestDTO request) {
        Long cartId = Long.parseLong(request.getCartId());
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed. Please open a new cart.");
        }

        // Try barcode first (local products), then fall back to prodId (Walmart products)
        Product product = productRepository.findByBarcode(request.getItemId())
                .or(() -> productRepository.findById(Long.parseLong(request.getItemId())))
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getItemId()));

        Double totalItemCost = product.getPrice();
        if (totalItemCost > cart.getBudget()) {
            throw new RuntimeException("Insufficient budget. Item costs $" + totalItemCost
                    + " but remaining budget is $" + cart.getBudget());
        }

        CartItem cartItem = CartItem.builder()
                .cartId(cartId)
                .prodId(product.getProdId())
                .productName(product.getProductName())
                .price(product.getPrice())
                .imageURL(product.getImageURL())
                .quantity(1)
                .itemType("packaged")
                .build();
        cartItemRepository.save(cartItem);

        Double remainingBudget = cart.getBudget() - totalItemCost;
        cart.setBudget(remainingBudget);
        cartRepository.save(cart);

        return AddPackagedResponseDTO.builder()
                .message("Item added to cart successfully")
                .build();
    }
    
    // ── Add Unpackaged Item to Cart ──────────────────────────────────────────
    // ====================== FINAL ADD UNPACKAGED ITEM TO CART ======================
    public AddUnpackagedProductResponseDTO addUnpackagedToCartFinal(
            AddUnpackagedCartItemRequestDTO request) {

        Long cartId = Long.parseLong(request.getCartId());
        Long itemId = Long.parseLong(request.getItemId());   // Real ID from bootstrap

        // Validate cart
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed. Please open a new cart.");
        }

        // Get product using real itemId
        UnpackagedProduct product = unpackagedProductRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + itemId));

        Double weight = request.getWeight();
        if (weight == null || weight <= 0) {
            throw new RuntimeException("Invalid weight received from frontend.");
        }

        // Calculate final price
        Double finalPrice;
        String priceBreakdown;

        if ("count".equalsIgnoreCase(product.getPricingType())) {
            finalPrice = product.getPricePerCount();
            priceBreakdown = String.format("$%.2f per unit", product.getPricePerCount());
        } else if ("lb_kg".equalsIgnoreCase(product.getPricingType())) {
            if (product.getPricePerLb() == null) {
                throw new RuntimeException("Price per lb not configured for: " + product.getName());
            }
            finalPrice = Math.round(product.getPricePerLb() * weight * 100.0) / 100.0;
            priceBreakdown = String.format("$%.2f/lb × %.3f lb = $%.2f",
                    product.getPricePerLb(), weight, finalPrice);
        } else {
            throw new RuntimeException("Unknown pricing type: " + product.getPricingType());
        }

        // Budget check
        if (finalPrice > cart.getBudget()) {
            throw new RuntimeException("Insufficient budget. Item costs $" + finalPrice
                    + " but remaining budget is $" + cart.getBudget());
        }

        // Save to cart
        CartItem cartItem = CartItem.builder()
                .cartId(cartId)
                .prodId(product.getId())
                .productName(product.getName())
                .price(finalPrice)
                .quantity(1)
                .imageURL(product.getImageUrl())
                .itemType("unpackaged")
                .build();

        cartItemRepository.save(cartItem);

        // Update remaining budget
        Double remainingBudget = cart.getBudget() - finalPrice;
        cart.setBudget(remainingBudget);
        cartRepository.save(cart);

        return AddUnpackagedProductResponseDTO.builder()
                .message("Added \"" + product.getName() + "\" — " + priceBreakdown)
                .build();
    }
    
    // ── Remove Item from Cart ────────────────────────────────────────────────
    public RemoveCartItemResponseDTO removeItemFromCart(RemoveCartItemRequestDTO request) {
        Long prodId = Long.parseLong(request.getItemId());
        Long cartId = Long.parseLong(request.getCartId());

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));
        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed.");
        }

        // Find by cartId + prodId (same pattern as increase/decrease)
        CartItem item = cartItemRepository.findByCartIdAndProdId(cartId, prodId);
        if (item == null) {
            throw new RuntimeException("Item not found in cart: " + prodId);
        }

        if (!item.getCartId().equals(cartId)) {
            throw new RuntimeException("Item does not belong to this cart.");
        }

        Double refundAmount = item.getPrice() * item.getQuantity();
        cart.setBudget(cart.getBudget() + refundAmount);
        cartRepository.save(cart);

        // ← delete using cartItemId, not prodId!
        cartItemRepository.deleteById(item.getCartItemId());

        return RemoveCartItemResponseDTO.builder()
                .message("Item " + item.getProductName() + " removed from cart successfully")
                .build();
    }

    // ── Increase Quantity ────────────────────────────────────
    public UpdateQuantityResponseDTO increaseQuantity(UpdateQuantityRequestDTO request) {

        Long cartId = Long.parseLong(request.getCartId());
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed. Please open a new cart.");
        }

        // Get the cart item first
        CartItem item = cartItemRepository.findByCartIdAndProdId(cartId, Long.parseLong(request.getItemId()));
        if (item == null) {
            throw new RuntimeException("Item not found in cart: " + request.getItemId());
        }

        // NOW check itemType and handle separately
        if (item.getItemType().equalsIgnoreCase("packaged")) {
            // ← No need to look up unpackagedProduct at all!
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);

            cart.setBudget(cart.getBudget() - item.getPrice());
            cartRepository.save(cart);

            return UpdateQuantityResponseDTO.builder()
                    .message("Successfully increased the quantity")
                    .build();

        } else if (item.getItemType().equalsIgnoreCase("unpackaged")) {
            // Only look up unpackagedProduct when we KNOW it's unpackaged
            UnpackagedProduct unpackagedProduct = unpackagedProductRepository.findById(item.getProdId())
                    .orElseThrow(() -> new RuntimeException("Unpackaged product not found: " + item.getProdId()));

            if (unpackagedProduct.getPricingType().equalsIgnoreCase("count")) {
                item.setQuantity(item.getQuantity() + 1);
                cartItemRepository.save(item);

                cart.setBudget(cart.getBudget() - unpackagedProduct.getPricePerCount());
                cartRepository.save(cart);

                return UpdateQuantityResponseDTO.builder()
                        .message("Successfully increased the quantity")
                        .build();
            } else {
                throw new RuntimeException("Unsupported pricing type: " + unpackagedProduct.getPricingType());
            }
        } else {
            throw new RuntimeException("Unknown item type: " + item.getItemType());
        }
    }
    // ── Decrease Quantity ────────────────────────────────────
   

//        if ("packaged".equals(request.getItemType())) {
//
//            Long cartItemId = Long.parseLong(request.getCartItemId());
//            Long cartId = Long.parseLong(request.getCartId());
//
//            Cart cart = cartRepository.findById(cartId)
//                    .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));
//            if (!cart.isActive()) {
//                throw new RuntimeException("Cart is closed. Please open a new cart.");
//            }
//
//            CartItem item = cartItemRepository.findById(cartItemId)
//                    .orElseThrow(() -> new RuntimeException("Item not found: " + cartItemId));
//
//            Integer quantity = item.getQuantity();
//
//            if (quantity == 1) {
//                cartItemRepository.deleteById(cartItemId);
//                cart.setBudget(cart.getBudget() + item.getPrice());
//                cartRepository.save(cart);
//
//                return UpdateQuantityResponseDTO.builder()
//                        .cartItemId(String.valueOf(item.getCartItemId()))
//                        .cartId(String.valueOf(cart.getCartId()))
//                        .prodId(String.valueOf(item.getProdId()))
//                        .isRemoved(true)
//                        .cartBudget(cart.getBudget())
//                        .build();
//            } else {
//                item.setQuantity(quantity - 1);
//                cartItemRepository.save(item);
//
//                cart.setBudget(cart.getBudget() + item.getPrice());
//                cartRepository.save(cart);
//
//                return UpdateQuantityResponseDTO.builder()
//                        .cartItemId(String.valueOf(item.getCartItemId()))
//                        .cartId(String.valueOf(cart.getCartId()))
//                        .prodId(String.valueOf(item.getProdId()))
//                        .isRemoved(false)
//                        .quantity(item.getQuantity())
//                        .cartBudget(cart.getBudget())
//                        .build();
//            }
//
//        } else {
//            throw new RuntimeException("Unsupported item type: " + request.getItemType());
//        }
    	
    public UpdateQuantityResponseDTO decreaseQuantity(UpdateQuantityRequestDTO request) {

        // commented code stays above...

        Long cartId = Long.parseLong(request.getCartId());
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        if (!cart.isActive()) {
            throw new RuntimeException("Cart is closed. Please open a new cart.");
        }

        // Find cart item by cartId + prodId (same fix as increaseQuantity)
        CartItem item = cartItemRepository.findByCartIdAndProdId(cartId, Long.parseLong(request.getItemId()));
        if (item == null) {
            throw new RuntimeException("Item not found in cart: " + request.getItemId());
        }

        // Check itemType FIRST before touching any product repo
        if (item.getItemType().equalsIgnoreCase("packaged")) {

            Integer quantity = item.getQuantity();

            if (quantity == 1) {
                // Remove item completely
                cartItemRepository.deleteById(item.getCartItemId());
                cart.setBudget(cart.getBudget() + item.getPrice());
                cartRepository.save(cart);

                return UpdateQuantityResponseDTO.builder()
                        .message("Item " + item.getProductName() + " removed from cart successfully")
                        .build();

            } else {
                // Just decrease
                item.setQuantity(quantity - 1);
                cartItemRepository.save(item);

                cart.setBudget(cart.getBudget() + item.getPrice());
                cartRepository.save(cart);

                return UpdateQuantityResponseDTO.builder()
                        .message("Successfully decreased the quantity")
                        .build();
            }

        } else if (item.getItemType().equalsIgnoreCase("unpackaged")) {
            // Only look up unpackaged product when we KNOW it's unpackaged
            UnpackagedProduct unpackagedProduct = unpackagedProductRepository.findById(item.getProdId())
                    .orElseThrow(() -> new RuntimeException("Unpackaged product not found: " + item.getProdId()));

            Integer quantity = item.getQuantity();

            if (unpackagedProduct.getPricingType().equalsIgnoreCase("count")) {

                if (quantity == 1) {
                    // Remove item completely
                    cartItemRepository.deleteById(item.getCartItemId());
                    cart.setBudget(cart.getBudget() + unpackagedProduct.getPricePerCount());
                    cartRepository.save(cart);

                    return UpdateQuantityResponseDTO.builder()
                            .message("Item " + item.getProductName() + " removed from cart successfully")
                            .build();

                } else {
                    // Just decrease
                    item.setQuantity(quantity - 1);
                    cartItemRepository.save(item);

                    cart.setBudget(cart.getBudget() + unpackagedProduct.getPricePerCount());
                    cartRepository.save(cart);

                    return UpdateQuantityResponseDTO.builder()
                            .message("Successfully decreased the quantity")
                            .build();
                }

            } else {
                // Weight-based unpackaged — can't decrease by count
                throw new RuntimeException("Unsupported pricing type: " + unpackagedProduct.getPricingType());
            }

        } else {
            throw new RuntimeException("Unknown item type: " + item.getItemType());
        }
    }
    
    public WeightResponseDTO getWeight(String machineId, Long ItemId) {
    	
    	UnpackagedProduct product = unpackagedProductRepository.findById(ItemId)
    			.orElseThrow(() -> new RuntimeException("Product not found: " + ItemId));
    	
    	String itemNumber = String.valueOf(product.getId());
    	
    	
    	PiData latestData = piDataRepository.findTopByMachineIdOrderByTimestampDesc(machineId);
//    	 liveWeight = String.valueOf(latestData.getReceivedWeight());
//    	String unitPrice = String.valueOf(product.getPricePerCount());
//    	String pricePerLb = String.valueOf(product.getPricePerLb());
    	
    	if(product.getPricingType().equalsIgnoreCase("count")) {
    		return WeightResponseDTO.builder()
        			.itemNumber(itemNumber)
        			.productName(product.getName())
        			.liveWeight(latestData.getReceivedWeight())
        			.unitPrice(product.getPricePerCount())
        			.imageURL(product.getImageUrl())
        			.build();
    		
    	}else {
    		
    		return WeightResponseDTO.builder()
        			.itemNumber(itemNumber)
        			.productName(product.getName())
        			.liveWeight(latestData.getReceivedWeight())
        			.unitPrice(product.getPricePerLb())
        			.imageURL(product.getImageUrl())
        			.build();
    		
    		
    	}
    	
    	
    }

    // ====================== VIEW FULL CART + TOTAL + QR CODE ======================
    public CartSummaryResponseDTO getCartSummary(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found: " + cartId));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);

        List<CartItemViewDTO> items = cartItems.stream().map(item ->
                CartItemViewDTO.builder()
                        .cartItemId(item.getCartItemId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .itemType(item.getItemType())
                        .imageURL(item.getImageURL())
                        .build()
        ).toList();

        Double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getPrice() * (item.getQuantity() != null ? item.getQuantity() : 1))
                .sum();

        // Generate JSON data for QR Code
        String qrData = String.format(
                "{\"cartId\":%d,\"totalAmount\":%.2f,\"items\":%s}",
                cartId, totalAmount, items
        );

        String qrCodeBase64 = qrCodeService.generateQRCode(qrData);

        return CartSummaryResponseDTO.builder()
                .cartId(cartId)
                .totalAmount(totalAmount)
                .remainingBudget(cart.getBudget())
                .items(items)
                .qrCodeBase64(qrCodeBase64)
                .message("Cart summary generated successfully")
                .build();
    }
    
    // ── Close Cart ───────────────────────────────────────────────────────────
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
