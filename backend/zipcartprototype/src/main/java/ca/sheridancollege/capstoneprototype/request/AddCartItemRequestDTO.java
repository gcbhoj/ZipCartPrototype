package ca.sheridancollege.capstoneprototype.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddCartItemRequestDTO {
    private String cartId;
    private String prodId;
    private Integer quantity;
    private String itemType;   // "packaged" or "unpackaged"
}
