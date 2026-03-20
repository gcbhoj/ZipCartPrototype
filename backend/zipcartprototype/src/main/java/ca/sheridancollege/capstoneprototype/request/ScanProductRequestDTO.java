package ca.sheridancollege.capstoneprototype.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScanProductRequestDTO {
    private boolean isValid;
    private String text;        
    private String format;     
    private String contentType;
}
