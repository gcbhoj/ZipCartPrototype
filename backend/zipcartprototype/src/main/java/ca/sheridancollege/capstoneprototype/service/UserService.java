package ca.sheridancollege.capstoneprototype.service;

import org.springframework.stereotype.Service;

import ca.sheridancollege.bijumonk.beans.User;
import ca.sheridancollege.bijumonk.repositories.UserRepository;
import ca.sheridancollege.bijumonk.response.GetUserResponseDTO;
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
