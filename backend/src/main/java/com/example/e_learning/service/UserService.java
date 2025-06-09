package com.example.e_learning.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.e_learning.dto.SignupRequest;
import com.example.e_learning.dto.UserDTO;
import com.example.e_learning.entity.User;
import com.example.e_learning.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public void registerUser(SignupRequest signupRequest) {
		if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
			throw new IllegalArgumentException("Username is already taken");
		}
		if (signupRequest.getUsername() == null || signupRequest.getUsername().trim().isEmpty()) {
			throw new IllegalArgumentException("Username cannot be empty");
		}
		if (signupRequest.getPassword() == null || signupRequest.getPassword().trim().isEmpty()) {
			throw new IllegalArgumentException("Password cannot be empty");
		}
		if (signupRequest.getEmail() == null || signupRequest.getEmail().trim().isEmpty()) {
			throw new IllegalArgumentException("Email cannot be empty");
		}
		User user = new User();
		user.setName(signupRequest.getName());
		user.setEmail(signupRequest.getEmail());
		user.setUsername(signupRequest.getUsername());
		user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
		user.setRole("USER"); // Default role
		userRepository.save(user);
	}

	public List<UserDTO> getAllUsers() {
		return userRepository.findAll().stream().map(user -> {
			UserDTO dto = new UserDTO();
			dto.setName(user.getName());
			dto.setEmail(user.getEmail());
			dto.setUsername(user.getUsername());
			return dto;
		}).collect(Collectors.toList());
	}

	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
		if (user.getRole() == null || user.getRole().trim().isEmpty()) {
			throw new IllegalStateException("User role cannot be empty for username: " + username);
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())));
	}
}
