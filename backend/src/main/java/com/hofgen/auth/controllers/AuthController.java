package com.hofgen.auth.controllers;

import com.hofgen.auth.models.User;
import com.hofgen.auth.payload.request.LoginRequest;
import com.hofgen.auth.payload.request.SignupRequest;
import com.hofgen.auth.payload.response.JwtResponse;
import com.hofgen.auth.payload.response.MessageResponse;
import com.hofgen.auth.repository.UserRepository;
import com.hofgen.auth.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      String jwt = jwtUtils.generateJwtToken(authentication);
      
      UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
      User user = userRepository.findByEmail(userPrincipal.getUsername()).get();

      return ResponseEntity.ok(new JwtResponse(jwt, 
                           user.getId(), 
                           user.getEmail(), 
                           user.getName(),
                           user.getType()));
    } catch (org.springframework.security.core.AuthenticationException e) {
      return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid email or password"));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User();
    user.setEmail(signUpRequest.getEmail());
    user.setPassword(encoder.encode(signUpRequest.getPassword()));
    user.setType(signUpRequest.getType());
    
    if ("individual".equals(signUpRequest.getType())) {
        user.setName(signUpRequest.getName());
    } else {
        user.setCompanyName(signUpRequest.getCompanyName());
        user.setEmpName(signUpRequest.getEmpName());
        user.setName(signUpRequest.getCompanyName()); // Generic name
    }

    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
