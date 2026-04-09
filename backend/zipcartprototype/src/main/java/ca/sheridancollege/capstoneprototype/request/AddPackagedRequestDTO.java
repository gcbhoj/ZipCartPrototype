package ca.sheridancollege.capstoneprototype.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPackagedRequestDTO {

	 private String cartId;
     private String itemId;
     //private Integer quantity;
     //private String itemType;   // "packaged" or "unpackaged"
}
