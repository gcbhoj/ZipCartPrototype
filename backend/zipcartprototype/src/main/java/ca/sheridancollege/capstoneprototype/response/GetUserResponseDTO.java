package ca.sheridancollege.capstoneprototype.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetUserResponseDTO {
    private String userId;
    private String userName;
    private String message;
}
