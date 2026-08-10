package ca.sheridancollege.capstoneprototype.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ca.sheridancollege.capstoneprototype.domain.PiData;
import ca.sheridancollege.capstoneprototype.repositories.PiDataRepository;
import ca.sheridancollege.capstoneprototype.request.AddPackagedRequestDTO;
import ca.sheridancollege.capstoneprototype.request.AddUnpackagedCartItemRequestDTO;
import ca.sheridancollege.capstoneprototype.request.InitCartRequestDTO;
import ca.sheridancollege.capstoneprototype.request.RemoveCartItemRequestDTO;
import ca.sheridancollege.capstoneprototype.request.ScanProductRequestDTO;
import ca.sheridancollege.capstoneprototype.request.UpdateQuantityRequestDTO;
import ca.sheridancollege.capstoneprototype.request.WeightRequestDTO;
import ca.sheridancollege.capstoneprototype.response.AddPackagedResponseDTO;
import ca.sheridancollege.capstoneprototype.response.AddUnpackagedProductResponseDTO;
import ca.sheridancollege.capstoneprototype.response.CartSummaryResponseDTO;
import ca.sheridancollege.capstoneprototype.response.GetUserResponseDTO;
import ca.sheridancollege.capstoneprototype.response.ImageProductResponseDTO;
import ca.sheridancollege.capstoneprototype.response.InitCartResponseDTO;
import ca.sheridancollege.capstoneprototype.response.RemoveCartItemResponseDTO;
import ca.sheridancollege.capstoneprototype.response.RetailerResponseDTO;
import ca.sheridancollege.capstoneprototype.response.ScanProductResponseDTO;
import ca.sheridancollege.capstoneprototype.response.SimpleUnpackagedScanResponseDTO;
import ca.sheridancollege.capstoneprototype.response.UpdateQuantityResponseDTO;
import ca.sheridancollege.capstoneprototype.response.ViewCartResponseDTO;
import ca.sheridancollege.capstoneprototype.response.WeightResponseDTO;
import ca.sheridancollege.capstoneprototype.services.CartService;
import ca.sheridancollege.capstoneprototype.services.MLService;
import ca.sheridancollege.capstoneprototype.services.ProductService;
import ca.sheridancollege.capstoneprototype.services.RetailerService;
import ca.sheridancollege.capstoneprototype.services.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ZipCartController {
	
	@Autowired
	private UserService userService;
	@Autowired
    private CartService cartService;
	@Autowired
    private ProductService productService;
	@Autowired
    private MLService mlService;
	@Autowired
	private RetailerService retailerService;
	@Autowired
	private PiDataRepository piDataRepository;
    
    private volatile Double weight = 0.0;
    
 // 1. Get User by ID (mock login)
    @GetMapping("/user/{userId}")
    public ResponseEntity<GetUserResponseDTO> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    
    @GetMapping("/allRetailers")
    public ResponseEntity<List<RetailerResponseDTO>> getRetailerInformation(){
    	return ResponseEntity.ok(retailerService.findAll());
    }

    // 2. Initialize Cart
    @PostMapping("/cart/init")
    public ResponseEntity<InitCartResponseDTO> initializeCart(@RequestBody InitCartRequestDTO request) {
        return ResponseEntity.ok(cartService.initializeCart(request));
    }

    // 3. Harcoded -data
    @PostMapping("/product/scan")
    public ResponseEntity<ScanProductResponseDTO> scanProductByBarcode(@RequestBody ScanProductRequestDTO request) {
        return ResponseEntity.ok(productService.scanByBarcode(request));
    }
    
    // view cart
    @GetMapping("/viewCart")
    public ResponseEntity<ViewCartResponseDTO> getCartById(@RequestParam Long cartId) {
        return ResponseEntity.ok(cartService.viewCartById(cartId));
    }

    // 4. Add Packaged Item to Cart  
    @PostMapping("/cart/addPackagedProduct")
    public ResponseEntity<AddPackagedResponseDTO> addPackagedItemToCart(@RequestBody AddPackagedRequestDTO request) {
        return ResponseEntity.ok(cartService.addPacakagedItemToCart(request));
    }
    
    @PatchMapping("/cart/increaseQuantity")
	public ResponseEntity<UpdateQuantityResponseDTO> increaseQuantity(@RequestBody UpdateQuantityRequestDTO request){
	  	return ResponseEntity.ok(cartService.increaseQuantity(request));
	}
    
    @PatchMapping("/cart/decreaseQuantity")
	public ResponseEntity<UpdateQuantityResponseDTO> decreaseQuantity(@RequestBody UpdateQuantityRequestDTO request){
	  	return ResponseEntity.ok(cartService.decreaseQuantity(request));
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
    public ResponseEntity<SimpleUnpackagedScanResponseDTO> scanUnpackagedProductByImage(
            @RequestParam("file") MultipartFile imageFile) {
        
        return ResponseEntity.ok(mlService.scanUnpackagedProduct(imageFile));
    }
    
    @PostMapping("/weight")
    public ResponseEntity<Void> receiveWeight(@RequestBody Map<String, Object> data){
    	String machineId = (String) data.get("machineId");
    	weight = ((Number) data.get("weight")).doubleValue();
    	double weightInLb = weight * 0.00220462;
    	
    	PiData piData = piDataRepository.findByMachineId(machineId);
    	if(piData == null) {
    		
    		piData = new PiData();
    		piData.setMachineId(machineId);
    	}
    	
    	piData.setReceivedWeight(weightInLb);
    	piData.setTimestamp(LocalDateTime.now());
    	piDataRepository.save(piData);
    	
    	return ResponseEntity.ok().build();
    }
    
    @PostMapping("/getWeight")
    public ResponseEntity<WeightResponseDTO> returnWeight(@RequestBody WeightRequestDTO request){
    	Long itemId = Long.valueOf(request.getItemId());
    	return ResponseEntity.ok(cartService.getWeight(request.getMachineId(), itemId));
    }
    
    // Final Add Unpackaged Item to Cart
    @PostMapping("/cart/add-unpackaged-final")
    public ResponseEntity<AddUnpackagedProductResponseDTO> addUnpackagedFinal(
            @RequestBody AddUnpackagedCartItemRequestDTO request) {

        return ResponseEntity.ok(cartService.addUnpackagedToCartFinal(request));
    }
    
    @PostMapping("/cart/remove-item")
    public ResponseEntity<RemoveCartItemResponseDTO> removeItemFromCart(
            @RequestBody RemoveCartItemRequestDTO request) {
        
        return ResponseEntity.ok(cartService.removeItemFromCart(request));
    }
    
    
    @GetMapping("/cart/summary/{cartId}")
    public ResponseEntity<CartSummaryResponseDTO> getCartSummary(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartService.getCartSummary(cartId));
    }

}
