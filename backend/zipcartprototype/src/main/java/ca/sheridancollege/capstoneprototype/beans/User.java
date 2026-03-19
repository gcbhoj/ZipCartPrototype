package ca.sheridancollege.capstoneprototype.beans;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name="_user")
public class User {

	@Id
	private Long userId;
	private String userName;
	private String email;
	private Number phone;
}
