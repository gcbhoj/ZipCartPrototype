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
@Table (name ="_cart")
public class Cart {

	@Id 
	private Long cartId;
	
	private Long userId;
	private Long retailerId;
	private String retailerName;
	private Double budget;
    private boolean isActive;
}
