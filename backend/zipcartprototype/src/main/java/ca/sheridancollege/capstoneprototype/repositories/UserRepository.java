package ca.sheridancollege.capstoneprototype.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.capstoneprototype.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
