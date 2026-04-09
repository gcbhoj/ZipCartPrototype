package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WeightResponseDTO {
	
	private String itemNumber;
	private String productName;
	private Double liveWeight;
	private Double unitPrice;
	private String imageURL;
}
