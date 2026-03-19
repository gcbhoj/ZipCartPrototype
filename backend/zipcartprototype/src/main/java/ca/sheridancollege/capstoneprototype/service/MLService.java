package ca.sheridancollege.capstoneprototype.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import ca.sheridancollege.bijumonk.beans.Product;
import ca.sheridancollege.bijumonk.repositories.ProductRepository;
import ca.sheridancollege.bijumonk.response.BarcodeScanResponseDTO;
import ca.sheridancollege.bijumonk.response.ImageProductResponseDTO;
import ca.sheridancollege.bijumonk.response.MLPredictResponseDTO;
import lombok.AllArgsConstructor;
import tools.jackson.databind.ObjectMapper;
@Service
@AllArgsConstructor
public class MLService {

    private final ProductRepository productRepository;

    // Python is on port 5001
    private static final String PYTHON_BASE_URL = "http://localhost:5001";

    // ── Endpoint 1: Packaged product — send image to Python barcode decoder ──
    public ImageProductResponseDTO scanPackagedProduct(MultipartFile imageFile) {
        try {
            BarcodeScanResponseDTO barcodeResult = sendImageToBarcodeDecoder(imageFile);

            // Barcode could not be read from image
            if (barcodeResult.getBarcodes() == null || barcodeResult.getBarcodes().isEmpty()) {
                throw new RuntimeException(
                    barcodeResult.getMessage() != null
                    ? barcodeResult.getMessage()
                    : "No barcode detected. Please try a clearer image.");
            }

            String detectedBarcode = barcodeResult.getBarcodes().get(0);

            // Try to find product in DB
            Optional<Product> productOpt = productRepository.findByBarcode(detectedBarcode);

            // If not found — still return the barcode number that was scanned
            if (productOpt.isEmpty()) {
                return ImageProductResponseDTO.builder()
                    .message("Barcode scanned successfully but product not found in database. Barcode: " + detectedBarcode)
                    .build();
            }

            // Product found — return full details
            Product product = productOpt.get();
            List<String> ingredientList = Arrays.asList(product.getIngredients().split(","));

            return ImageProductResponseDTO.builder()
                    .itemNumber(product.getProdId())
                    .productName(product.getProductName())
                    .imageURL(product.getImageURL())
                    .price(product.getPrice())
                    .weight(product.getWeight())
                    .ingredients(ingredientList)
                    .manufacturer(product.getManufacturer())
                    .manufacturedIn(product.getManufacturedIn())
                    .aboutProduct(product.getAboutProduct())
                    .message("Product found: " + product.getProductName())
                    .build();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process image: " + e.getMessage());
        }
    }
    // ── Endpoint 2: Unpackaged product — send image to Python ML model ──
    public ImageProductResponseDTO scanUnpackagedProduct(MultipartFile imageFile) {
        try {
            MLPredictResponseDTO mlResult = sendImageToMLPredictor(imageFile);

            if (mlResult == null || mlResult.getProductName() == null) {
                throw new RuntimeException("ML model could not identify the product. Please try again.");
            }

            // ML returns product name — look it up by name in your DB
            Product product = productRepository.findByProductName(mlResult.getProductName())
                .orElseThrow(() -> new RuntimeException(
                    "Product not in database: " + mlResult.getProductName() 
                    + " (confidence: " + mlResult.getConfidence() + "%)"));

            List<String> ingredientList = Arrays.asList(product.getIngredients().split(","));

            // No tax/total here — only on final barcode generation ✅
            return ImageProductResponseDTO.builder()
                .itemNumber(product.getProdId())
                .productName(product.getProductName())
                .imageURL(product.getImageURL())
                .price(product.getPrice())
                .weight(product.getWeight())
                .ingredients(ingredientList)
                .manufacturer(product.getManufacturer())
                .manufacturedIn(product.getManufacturedIn())
                .aboutProduct(product.getAboutProduct())
                .confidence(mlResult.getConfidence())
                .message("Unpackaged product identified via ML (confidence: " 
                    + String.format("%.1f", mlResult.getConfidence()) + "%)")
                .build();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process unpackaged product image: " + e.getMessage());
        }
    }

    // ── Internal: calls /api/py/simple_decode ────────────────────
    private BarcodeScanResponseDTO sendImageToBarcodeDecoder(MultipartFile imageFile) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(imageFile.getBytes()) {
            @Override
            public String getFilename() {
                return imageFile.getOriginalFilename();
            }
        });

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        // Get raw string first so we can see exactly what Python returned
        ResponseEntity<String> rawResponse = restTemplate.exchange(
            PYTHON_BASE_URL + "/api/py/simple_decode",
            HttpMethod.POST,
            entity,
            String.class
        );

        String responseBody = rawResponse.getBody();
        System.out.println("Python raw response: " + responseBody); // shows in Eclipse console

        // Now parse it
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(responseBody, BarcodeScanResponseDTO.class);
    }

    // ── Internal: calls /api/py/predict_fruits_veg ───────────────
    private MLPredictResponseDTO sendImageToMLPredictor(MultipartFile imageFile) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(imageFile.getBytes()) {
            @Override
            public String getFilename() {
                return imageFile.getOriginalFilename();
            }
        });

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<MLPredictResponseDTO> response = restTemplate.exchange(
            PYTHON_BASE_URL + "/api/py/predict_fruits_veg",
            HttpMethod.POST,
            entity,
            MLPredictResponseDTO.class
        );

        return response.getBody();
    }
}