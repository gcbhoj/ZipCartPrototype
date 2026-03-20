package ca.sheridancollege.capstoneprototype.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ca.sheridancollege.bijumonk.request.AddCartItemRequestDTO;
import ca.sheridancollege.bijumonk.request.InitCartRequestDTO;
import ca.sheridancollege.bijumonk.request.ScanProductRequestDTO;
import ca.sheridancollege.bijumonk.response.AddCartItemResponseDTO;
import ca.sheridancollege.bijumonk.response.GetUserResponseDTO;
import ca.sheridancollege.bijumonk.response.ImageProductResponseDTO;
import ca.sheridancollege.bijumonk.response.InitCartResponseDTO;
import ca.sheridancollege.bijumonk.response.ScanProductResponseDTO;
import ca.sheridancollege.bijumonk.services.CartService;
import ca.sheridancollege.bijumonk.services.MLService;
import ca.sheridancollege.bijumonk.services.ProductService;
import ca.sheridancollege.bijumonk.services.UserService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class HomeController {
	
	private UserService userService;
    private CartService cartService;
    private ProductService productService;
    private MLService mlService;


    // 1. Get User by ID (mock login)
    @GetMapping("/user/{userId}")
    public ResponseEntity<GetUserResponseDTO> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // 2. Initialize Cart
    @PostMapping("/cart/init")
    public ResponseEntity<InitCartResponseDTO> initializeCart(@RequestBody InitCartRequestDTO request) {
        return ResponseEntity.ok(cartService.initializeCart(request));
    }

    // 3. Scan Product by Barcode
    @PostMapping("/product/scan")
    public ResponseEntity<ScanProductResponseDTO> scanProductByBarcode(@RequestBody ScanProductRequestDTO request) {
        return ResponseEntity.ok(productService.scanByBarcode(request));
    }

    // 4. Add Item to Cart  
    @PostMapping("/cart/add-item")
    public ResponseEntity<AddCartItemResponseDTO> addItemToCart(@RequestBody AddCartItemRequestDTO request) {
        return ResponseEntity.ok(cartService.addItemToCart(request));
    }

    // 5. Close Cart  
    @PutMapping("/cart/close/{cartId}/{userId}")
    public ResponseEntity<String> closeCart(@PathVariable Long cartId, @PathVariable Long userId) {
        return ResponseEntity.ok(cartService.closeCart(cartId, userId));
    }
    
 // 6. Packaged product — image → Python barcode decoder → DB lookup
    @PostMapping("/product/scan-packaged-image")
    public ResponseEntity<ImageProductResponseDTO> scanPackagedProductByImage(
            @RequestParam("file") MultipartFile imageFile) {
        return ResponseEntity.ok(mlService.scanPackagedProduct(imageFile));
    }

    // 7. Unpackaged product (fruit/veg) — image → Python ML model → DB lookup  
    @PostMapping("/product/scan-unpackaged-image")
    public ResponseEntity<ImageProductResponseDTO> scanUnpackagedProductByImage(
            @RequestParam("file") MultipartFile imageFile) {
        return ResponseEntity.ok(mlService.scanUnpackagedProduct(imageFile));
    }
    
}
