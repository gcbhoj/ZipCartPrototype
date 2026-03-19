package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddCartItemResponseDTO {
    private String cartItemId;
    private String productName;
    private Double price;
    private Integer quantity;
    private String itemType;
    private Double remainingBudget;
    private String message;
}
