package ca.sheridancollege.capstoneprototype.internalAPIService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import ca.sheridancollege.capstoneprototype.models.FruitsVegPreditResponse;
import ca.sheridancollege.capstoneprototype.requestGenerator.PostRequestsGenerator;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PythonServices {
	
	private PostRequestsGenerator postReqGenerator;
	
	
	private final String fruitsVegPredictUrl = "http://localhost:5001/api/py/predict_fruits_veg";
	
	
	
	public FruitsVegPreditResponse predictFrutisAndVeg(MultipartFile file) {
		
		
        String response = postReqGenerator.postMultipartFile(fruitsVegPredictUrl, file);

        try {
            ObjectMapper mapper = new ObjectMapper();

            FruitsVegPreditResponse result =
                    mapper.readValue(response, FruitsVegPreditResponse.class);

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Python API response", e);
        }
    }
	

}
