package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InitCartResponseDTO {
    private String cartId;
    private String retailerName;
    private Double budget;
    private String message;
}
