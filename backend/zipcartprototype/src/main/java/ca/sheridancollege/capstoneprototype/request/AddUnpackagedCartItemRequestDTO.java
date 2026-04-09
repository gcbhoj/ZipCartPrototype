package ca.sheridancollege.capstoneprototype.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddUnpackagedCartItemRequestDTO {

    private String cartId;
    private String itemId;
    private Double weight; // weight from frontend (from ML response)
}