package ca.sheridancollege.capstoneprototype.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InitCartRequestDTO {
    private String userId;
    private String retailerId;
    private Double budget;
}
