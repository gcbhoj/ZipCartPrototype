package ca.sheridancollege.capstoneprototype.domain;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Product {
	
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long prodId;

    private String barcode;
    private String productName;
    private String imageURL;
    private Double price;
    private String weight;

    @Column(length = 1000)
    private String ingredients;  

    private Date manufacturedDate;
    private Date expiryDate;
    private String manufacturer;
    private String manufacturedIn;

    @Column(length = 1000)
    private String aboutProduct;

    private Integer quantity;

}

