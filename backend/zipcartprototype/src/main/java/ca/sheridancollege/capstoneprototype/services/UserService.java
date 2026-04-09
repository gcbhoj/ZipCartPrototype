package ca.sheridancollege.capstoneprototype.services;

import org.springframework.stereotype.Service;

import ca.sheridancollege.capstoneprototype.domain.User;
import ca.sheridancollege.capstoneprototype.repositories.UserRepository;
import ca.sheridancollege.capstoneprototype.response.GetUserResponseDTO;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;

    public GetUserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return GetUserResponseDTO.builder()
                .userId(String.valueOf(user.getUserId()))
                .userName(user.getUserName())
                .message("User fetched successfully")
                .build();
    }

}
