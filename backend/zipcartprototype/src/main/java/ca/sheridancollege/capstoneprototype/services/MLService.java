package ca.sheridancollege.capstoneprototype.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

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

import ca.sheridancollege.capstoneprototype.domain.BarcodeCache;
import ca.sheridancollege.capstoneprototype.domain.Product;
import ca.sheridancollege.capstoneprototype.domain.UnpackagedProduct;
import ca.sheridancollege.capstoneprototype.repositories.BarcodeCacheRepository;
import ca.sheridancollege.capstoneprototype.repositories.ProductRepository;
import ca.sheridancollege.capstoneprototype.repositories.UnpackagedProductRepository;
import ca.sheridancollege.capstoneprototype.response.BarcodeScanResponseDTO;
import ca.sheridancollege.capstoneprototype.response.ImageProductResponseDTO;
import ca.sheridancollege.capstoneprototype.response.ImageProductResponseDTO.UnpackagedCandidate;
import ca.sheridancollege.capstoneprototype.response.MLPredictResponseDTO;
import ca.sheridancollege.capstoneprototype.response.SimpleUnpackagedScanResponseDTO;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class MLService {

    private final ProductRepository productRepository;
    private final BarcodeCacheRepository barcodeCacheRepository;
    private final UnpackagedProductRepository unpackagedProductRepository;

    private static final String PYTHON_BASE_URL = "http://localhost:5001";
    private static final String SPRING_WEIGHT_URL = "http://localhost:8080/api/receivedWeight";

    private final Map<String, List<UnpackagedCandidate>> predictionSessions = new ConcurrentHashMap<>();

    // ====================== PACKAGED PRODUCT ======================
    public ImageProductResponseDTO scanPackagedProduct(MultipartFile imageFile) {
        try {
            BarcodeScanResponseDTO barcodeResult = sendImageToBarcodeDecoder(imageFile);

            if (barcodeResult.getBarcodes() == null || barcodeResult.getBarcodes().isEmpty()) {
                throw new RuntimeException(
                        barcodeResult.getMessage() != null ? barcodeResult.getMessage() : "No barcode detected.");
            }

            String detectedBarcode = barcodeResult.getBarcodes().get(0);
            String barcode = detectedBarcode.replaceAll("^0+", "");

            ImageProductResponseDTO product = getProductDetails(barcode);
            if (product != null) return product;

            return ImageProductResponseDTO.builder()
                    .message("Product not found for the barcode: " + detectedBarcode)
                    .build();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process packaged image: " + e.getMessage());
        }
    }

 // ====================== UNPACKAGED PRODUCT ======================
    // ====================== UNPACKAGED PRODUCT - SIMPLE LIST ======================
    public SimpleUnpackagedScanResponseDTO scanUnpackagedProduct(MultipartFile imageFile) {
        try {
            List<MLPredictResponseDTO.PredictionItem> mlPredictions = sendImageToMLPredictorFlexible(imageFile);

            if (mlPredictions.isEmpty()) {
                throw new RuntimeException("ML model could not identify the product.");
            }

            List<SimpleUnpackagedScanResponseDTO.SimplePrediction> simplePredictions = new ArrayList<>();

            // Limit to top 3 predictions
            int limit = Math.min(3, mlPredictions.size());

            for (int i = 0; i < limit; i++) {
                MLPredictResponseDTO.PredictionItem pred = mlPredictions.get(i);
                String name = pred.getProductName().trim();

                // Cross-check with UnpackagedProduct repository
                Optional<UnpackagedProduct> dbMatch = unpackagedProductRepository.findByNameIgnoreCase(name);

                Integer itemNumber = null;
                String imageURL = null;

                if (dbMatch.isPresent()) {
                    UnpackagedProduct up = dbMatch.get();
                    itemNumber = up.getId().intValue();   // Use real ID from bootstrap as itemNumber
                    imageURL = up.getImageUrl();
                }

                simplePredictions.add(
                    SimpleUnpackagedScanResponseDTO.SimplePrediction.builder()
                        .itemNumber(itemNumber)
                        .productName(name)
                        .imageURL(imageURL)
                        .build()
                );
            }

            return SimpleUnpackagedScanResponseDTO.builder()
                    .predictions(simplePredictions)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to process unpackaged image: " + e.getMessage());
        }
    }
    
    private List<MLPredictResponseDTO.PredictionItem> sendImageToMLPredictorFlexible(MultipartFile imageFile) throws Exception {
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

        ResponseEntity<String> rawResponse = restTemplate.exchange(
                PYTHON_BASE_URL + "/api/py/predict_fruits_veg",
                HttpMethod.POST,
                entity,
                String.class);

        String json = rawResponse.getBody();
        
        // Debug output
        System.out.println("🔍 RAW PYTHON RESPONSE: " + json);
        System.out.println("🔍 STATUS: " + rawResponse.getStatusCode());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json);

        List<MLPredictResponseDTO.PredictionItem> list = new ArrayList<>();

        // NEW: Handle the actual structure Python is returning
        if (root.has("topPredictions") && root.get("topPredictions").isArray()) {
            JsonNode predictionsArray = root.get("topPredictions");
            for (JsonNode node : predictionsArray) {
                String name = node.has("productName") ? node.get("productName").asText() : "Unknown";
                double conf = node.has("confidence") ? node.get("confidence").asDouble() : 0.0;
                
                list.add(new MLPredictResponseDTO.PredictionItem(name, conf));
            }
        }
        // Fallback: single "data" object
        else if (root.has("data") && root.get("data").has("productName")) {
            JsonNode data = root.get("data");
            String name = data.get("productName").asText();
            double conf = data.has("confidence") ? data.get("confidence").asDouble() : 0.0;
            list.add(new MLPredictResponseDTO.PredictionItem(name, conf));
        }
        // Old fallbacks (keep them for safety)
        else if (root.isArray()) {
            for (JsonNode node : root) {
                String name = node.has("productName") ? node.get("productName").asText() : "Unknown";
                double conf = node.has("confidence") ? node.get("confidence").asDouble() : 0.0;
                list.add(new MLPredictResponseDTO.PredictionItem(name, conf));
            }
        } else if (root.has("productName")) {
            String name = root.get("productName").asText();
            double conf = root.has("confidence") ? root.get("confidence").asDouble() : 0.0;
            list.add(new MLPredictResponseDTO.PredictionItem(name, conf));
        }

        System.out.println("✅ Parsed " + list.size() + " predictions from Python");
        if (!list.isEmpty()) {
            System.out.println("   First prediction: " + list.get(0).getProductName() + " (" + list.get(0).getConfidence() + "%)");
        }

        return list;
    }

    public UnpackagedCandidate resolveSelection(String sessionId, Integer selectionId) {
        List<UnpackagedCandidate> candidates = predictionSessions.get(sessionId);
        if (candidates == null || selectionId == null || selectionId < 1 || selectionId > candidates.size()) {
            throw new RuntimeException("Invalid session or selection ID");
        }
        return candidates.get(selectionId - 1);
    }

    public void clearSession(String sessionId) {
        predictionSessions.remove(sessionId);
    }

    private Double fetchWeightFromScale() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<ca.sheridancollege.capstoneprototype.domain.PiData> response =
                    restTemplate.getForEntity(SPRING_WEIGHT_URL, ca.sheridancollege.capstoneprototype.domain.PiData.class);
            if (response.getBody() != null && response.getBody().getReceivedWeight() != null) {
                return response.getBody().getReceivedWeight();
            }
        } catch (Exception e) {
            System.out.println("Scale not reachable: " + e.getMessage());
        }
        return 0.0;
    }

    private Double computePrice(UnpackagedProduct up, Double weightLb) {
        if ("count".equals(up.getPricingType())) {
            return up.getPricePerCount() != null ? up.getPricePerCount() : 0.0;
        } else if ("lb_kg".equals(up.getPricingType())) {
            if (up.getPricePerLb() != null && weightLb != null && weightLb > 0) {
                return Math.round(up.getPricePerLb() * weightLb * 100.0) / 100.0;
            }
        }
        return 0.0;
    }

    private String buildPriceMessage(UnpackagedProduct up, Double weightLb, Double computedPrice) {
        if ("count".equals(up.getPricingType())) {
            return String.format("Priced per unit: $%.2f each", up.getPricePerCount());
        } else if ("lb_kg".equals(up.getPricingType())) {
            if (weightLb != null && weightLb > 0) {
                return String.format("$%.2f/lb × %.3f lb = $%.2f", up.getPricePerLb(), weightLb, computedPrice);
            }
            return String.format("$%.2f/lb — scale not connected", up.getPricePerLb());
        }
        return "Price unavailable";
    }

    private BarcodeScanResponseDTO sendImageToBarcodeDecoder(MultipartFile imageFile) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(imageFile.getBytes()) {
            @Override public String getFilename() { return imageFile.getOriginalFilename(); }
        });
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> rawResponse = restTemplate.exchange(
                PYTHON_BASE_URL + "/api/py/simple_decode", HttpMethod.POST, entity, String.class);

        return new ObjectMapper().readValue(rawResponse.getBody(), BarcodeScanResponseDTO.class);
    }

    // ====================== WALMART API ======================
    @SuppressWarnings("deprecation")
    private ImageProductResponseDTO getProductDetails(String barcode) {
        try {
            String API_KEY = "BB072940EAD8455A86D6BB267D83572D";
            String walmart_domain = "walmart.ca";
            String store_id = "5778";
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            Optional<BarcodeCache> storedBarcode = barcodeCacheRepository.findByBarcode(barcode);
            if (storedBarcode.isPresent()) {
                String cacheItem_id = storedBarcode.get().getItemId();
                String itemUrl = "https://api.bluecartapi.com/request?api_key=" + API_KEY
                        + "&type=product&walmart_domain=" + walmart_domain
                        + "&item_id=" + cacheItem_id + "&store_id=" + store_id;
                ResponseEntity<String> itemResponse = restTemplate.getForEntity(itemUrl, String.class);
                JsonNode itemData = mapper.readTree(itemResponse.getBody());
                if (itemData.has("product")) return apiResponse(itemData.get("product"), barcode);
            }

            String searchUrl = "https://api.bluecartapi.com/request?api_key=" + API_KEY
                    + "&type=search&walmart_domain=" + walmart_domain + "&search_term=" + barcode;
            ResponseEntity<String> searchResponse = restTemplate.getForEntity(searchUrl, String.class);
            JsonNode searchData = mapper.readTree(searchResponse.getBody());

            if (!searchData.has("search_results") || searchData.get("search_results").isEmpty()) return null;

            String item_id = searchData.get("search_results").get(0).get("product").get("item_id").asText();
            saveToCacheDB(barcode, item_id);

            String itemUrl = "https://api.bluecartapi.com/request?api_key=" + API_KEY
                    + "&type=product&walmart_domain=" + walmart_domain
                    + "&item_id=" + item_id + "&store_id=" + store_id;
            ResponseEntity<String> itemResponse = restTemplate.getForEntity(itemUrl, String.class);
            JsonNode itemData = mapper.readTree(itemResponse.getBody());
            if (itemData.has("product")) return apiResponse(itemData.get("product"), barcode);

        } catch (Exception e) {
            throw new RuntimeException("Api error:" + e.getMessage());
        }
        return null;
    }

    @SuppressWarnings("deprecation")
    private ImageProductResponseDTO apiResponse(JsonNode product, String barcode) {
        // ── Parse ingredients ──────────────────────────────────────────────
        List<String> ingredients = new ArrayList<>();
        if (product.has("ingredients")) {
            ingredients = Arrays.asList(product.get("ingredients").asText().split(","));
        }

        // ── Extract fields from API ────────────────────────────────────────
        Long itemNumber = null;
        if (product.has("item_id") && !product.get("item_id").isNull()) {
            itemNumber = product.get("item_id").asLong();
        }

        String title        = product.get("title").asText();
        String imageURL     = product.get("main_image").get("link").asText();
        Double price        = product.get("buybox_winner").get("price").asDouble();
        String manufacturer = product.has("brand") ? product.get("brand").asText() : "N/A";
        String about        = product.has("description") ? product.get("description").asText() : "N/A";
        String ingredientsStr = String.join(",", ingredients);

        // ── Save to local DB if not already there ──────────────────────────
        if (itemNumber != null) {
            final Long finalItemNumber = itemNumber;
            boolean exists = productRepository.existsById(finalItemNumber);
            if (!exists) {
                Product p = Product.builder()
                        .prodId(finalItemNumber)
                        .barcode(barcode)
                        .productName(title)
                        .imageURL(imageURL)
                        .price(price)
                        .manufacturer(manufacturer)
                        .aboutProduct(about)
                        .ingredients(ingredientsStr)
                        .quantity(1)
                        .build();
                productRepository.save(p);
                System.out.println("Saved new product to DB: " + title + " (id=" + finalItemNumber + ")");
            }
        }

        // ── Build and return response ──────────────────────────────────────
        return ImageProductResponseDTO.builder()
                .itemNumber(itemNumber)
                .productName(title)
                .imageURL(imageURL)
                .price(price)
                .manufacturer(manufacturer)
                .ingredients(ingredients)
                .aboutProduct(about)
                .message("Product found: " + title)
                .build();
    }

    private void saveToCacheDB(String barcode, String ItemId) {
        BarcodeCache cache = BarcodeCache.builder().barcode(barcode).ItemId(ItemId).build();
        barcodeCacheRepository.save(cache);
    }
}
