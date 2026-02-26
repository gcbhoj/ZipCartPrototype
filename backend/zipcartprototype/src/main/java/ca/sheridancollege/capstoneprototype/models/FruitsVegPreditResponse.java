package ca.sheridancollege.capstoneprototype.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FruitsVegPreditResponse {
	
	private float confidence;
	private String productName;

}
