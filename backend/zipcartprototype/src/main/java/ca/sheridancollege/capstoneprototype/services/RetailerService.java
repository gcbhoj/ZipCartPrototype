package ca.sheridancollege.capstoneprototype.services;

import java.util.List;

import org.springframework.stereotype.Service;

import ca.sheridancollege.capstoneprototype.repositories.RetailerRepository;
import ca.sheridancollege.capstoneprototype.response.RetailerResponseDTO;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RetailerService {
	
	private RetailerRepository retailerRepository;
	
	public List<RetailerResponseDTO> findAll(){
		return retailerRepository.findAll()
				.stream()
				.map(retailer -> new RetailerResponseDTO(
						retailer.getRetailerId(),
						retailer.getRetailerName(),
						retailer.getRetailerUrl(),
						retailer.getRetailerLogoUrl()
						
						))
				.toList();
	}

}
