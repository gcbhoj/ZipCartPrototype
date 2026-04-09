package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemViewDTO {

	private Long cartItemId;
    private String productName;
    private Double price;
    private Integer quantity;
    private String itemType;   // "packaged" or "unpackaged"
    private String imageURL;
}
