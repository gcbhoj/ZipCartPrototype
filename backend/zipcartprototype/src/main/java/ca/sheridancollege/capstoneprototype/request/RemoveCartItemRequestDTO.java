package ca.sheridancollege.capstoneprototype.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RemoveCartItemRequestDTO {
	
	 private String cartId;
	 private String itemId;


}
