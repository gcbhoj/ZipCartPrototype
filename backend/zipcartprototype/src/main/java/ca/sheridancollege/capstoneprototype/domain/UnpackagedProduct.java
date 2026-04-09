package ca.sheridancollege.capstoneprototype.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnpackagedProduct {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String pricingType;  // "lb_kg" or "count"
    private Double pricePerLb;
    private Double pricePerKg;
    private Double pricePerCount;
    private String imageUrl;
}
