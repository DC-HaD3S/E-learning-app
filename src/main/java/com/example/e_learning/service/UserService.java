package com.example.e_learning.service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.e_learning.entity.EnrolledCourse;
import com.example.e_learning.entity.User;
import com.example.e_learning.repository.EnrolledCourseRepository;
import com.example.e_learning.repository.UserRepository;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EnrolledCourseRepository enrolledCourseRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Value("${jwt.secret}")
    private String jwtSecret;

    public Map<String, Object> signUp(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        user.setUserid(null);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setRole("user");
        User savedUser = userRepository.save(user);
        Map<String, Object> response = new HashMap<>();
        response.put("user", savedUser);
        response.put("token", generateJwtToken(savedUser));
        return response;
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", generateJwtToken(user));
            return response;
        }
        throw new RuntimeException("Invalid credentials");
    }

    private String generateJwtToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new java.util.Date())
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key)
                .compact();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<EnrolledCourse> getEnrolledCourses(Integer userid) {
        return enrolledCourseRepository.findByUserid(userid);
    }

	public List<User> getRegisteredUsers() {    
		return userRepository.findAll();
    }

}	