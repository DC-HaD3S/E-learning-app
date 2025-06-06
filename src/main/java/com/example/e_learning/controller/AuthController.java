//package com.example.e_learning.controller;
//
//
//import com.example.e_learning.entity.User;
//import com.example.e_learning.repository.UserRepository;
//import com.example.e_learning.config.JwtUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> signup(@RequestBody User user) {
//        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Username already registered"));
//        }
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
//        String username = credentials.get("username");
//        String password = credentials.get("password");
//
//        if (username.equals("admin") && password.equals("admin123")) {
//            String token = jwtUtil.generateToken(username);
//            Map<String, String> response = new HashMap<>();
//            response.put("token", token);
//            response.put("role", "admin");
//            return ResponseEntity.ok(response);
//        }
//
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        
//        if (!passwordEncoder.matches(password, user.getPassword())) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
//        }
//
//        String token = jwtUtil.generateToken(username);
//        Map<String, String> response = new HashMap<>();
//        response.put("token", token);
//        response.put("role", "user");
//        return ResponseEntity.ok(response);
//    }
//}
