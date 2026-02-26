package ca.sheridancollege.capstoneprototype.controllers;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ca.sheridancollege.capstoneprototype.internalAPIService.PythonServices;
import ca.sheridancollege.capstoneprototype.models.FruitsVegPreditResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/zipcart/analytics")
@AllArgsConstructor
public class PythonServicesController {
	
	private final PythonServices pyServices;
	
	@PostMapping(value="/identify_fruits_vegetables", consumes = MediaType.MULTIPART_FORM_DATA_VALUE
			)
    public ResponseEntity<FruitsVegPreditResponse> identifyFruitsAndVegetables(
            @RequestParam("file") MultipartFile file) {
		
	FruitsVegPreditResponse response = pyServices.predictFrutisAndVeg(file);

return ResponseEntity.ok(response);
	}
	

}
