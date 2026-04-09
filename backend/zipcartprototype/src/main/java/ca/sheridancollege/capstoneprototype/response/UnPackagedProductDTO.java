package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnPackagedProductDTO {
	
	private Long prodId;
    private String productName;
    private String imageURL;
    private Double price;
    private Integer quantity;

}
