package ca.sheridancollege.capstoneprototype.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder
public class ImageProductResponseDTO {

	private Long itemNumber;
    private String productName;
    private String imageURL;
    private Double price;
    private String weight;
    private List<String> ingredients;
    private String manufacturer;
    private String manufacturedIn;
    private String aboutProduct;
    private Double confidence;
    private Double weightFromScale;
    private String message;

    
private List<UnpackagedCandidate> candidates;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public static class UnpackagedCandidate {
	private Integer id;                    
    private String productName;
    private Double confidence;
    private String pricingType;
    private Double pricePerLb;
    private Double pricePerKg;
    private Double pricePerCount;
    private Double weightFromScale;
    private Double computedPrice;   // price * weight or price * count
    private boolean foundInDb;
    private String imageURL;
    private String message;
    
}
}
