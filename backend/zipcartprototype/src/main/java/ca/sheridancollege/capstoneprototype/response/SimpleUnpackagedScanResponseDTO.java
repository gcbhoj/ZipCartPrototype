package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleUnpackagedScanResponseDTO {

    private List<SimplePrediction> predictions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimplePrediction {
        private Integer itemNumber;      // null for unpackaged
        private String productName;
        private String imageURL;
    }
}