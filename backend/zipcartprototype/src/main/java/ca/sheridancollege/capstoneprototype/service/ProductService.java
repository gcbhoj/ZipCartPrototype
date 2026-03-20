package ca.sheridancollege.capstoneprototype.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import ca.sheridancollege.bijumonk.beans.Product;
import ca.sheridancollege.bijumonk.repositories.ProductRepository;
import ca.sheridancollege.bijumonk.request.ScanProductRequestDTO;
import ca.sheridancollege.bijumonk.response.ScanProductResponseDTO;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductService {

	private ProductRepository productRepository;
	
	
	public ScanProductResponseDTO scanByBarcode(ScanProductRequestDTO request) {
        if (!request.isValid()) {
            throw new RuntimeException("Invalid barcode scan");
        }

        Product product = productRepository.findByBarcode(request.getText())
                .orElseThrow(() -> new RuntimeException("Product not found for barcode: " + request.getText()));

        // ingredients stored as comma-separated string → split into list
        List<String> ingredientList = Arrays.asList(product.getIngredients().split(","));

        return ScanProductResponseDTO.builder()
                .itemNumber(product.getProdId())
                .productName(product.getProductName())
                .imageURL(product.getImageURL())
                .price(product.getPrice())
                .weight(product.getWeight())
                .ingredients(ingredientList)
                .manufacturedDate(product.getManufacturedDate())
                .expiryDate(product.getExpiryDate())
                .manufacturer(product.getManufacturer())
                .manufacturedIn(product.getManufacturedIn())
                .aboutProduct(product.getAboutProduct())
                .quantity(product.getQuantity())
                .build();
    }
}
