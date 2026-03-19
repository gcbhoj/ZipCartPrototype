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
    private String message;
}
