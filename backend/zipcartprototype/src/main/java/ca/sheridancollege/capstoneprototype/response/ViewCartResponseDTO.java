package ca.sheridancollege.capstoneprototype.response;

import java.util.List;

import ca.sheridancollege.capstoneprototype.domain.Product;
import ca.sheridancollege.capstoneprototype.domain.UnpackagedProduct;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ViewCartResponseDTO {

	private String cartId;       
    private String userId;       
    private List<PackagedProductDTO> packagedProducts;
    private List<UnPackagedProductDTO> unpackagedProducts;
    private Double hst;
    private Double total;
}
