package ca.sheridancollege.capstoneprototype.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table (name="_retailer")
public class Retailer {

	@Id
	private Long retailerId;
    private String retailerName;
    private String retailerUrl;
    private String retailerLogoUrl;
}
