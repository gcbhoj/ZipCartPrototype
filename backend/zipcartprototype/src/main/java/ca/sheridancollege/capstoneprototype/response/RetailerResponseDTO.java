package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RetailerResponseDTO {

	private Long retailerId;
    private String retailerName;
    private String retailerUrl;
    private String retailerLogoUrl;
}
