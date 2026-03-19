package ca.sheridancollege.capstoneprototype.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.bijumonk.beans.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
