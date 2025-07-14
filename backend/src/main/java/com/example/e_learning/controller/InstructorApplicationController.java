
package com.example.e_learning.controller;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.e_learning.dto.InstructorApplicationDTO;
import com.example.e_learning.dto.InstructorApplicationRequestDTO;
import com.example.e_learning.service.InstructorApplicationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.dao.DataAccessException;

@Tag(name = "instructor", description = "Endpoints for managing instructor applications and approvals")
@RestController
@RequestMapping("/instructor")
public class InstructorApplicationController {
    private static final Logger logger = LoggerFactory.getLogger(InstructorApplicationController.class);

    @Autowired
    private InstructorApplicationService service;

    @Operation(
        summary = "Submit an instructor application",
        description = "Allows a user to submit an instructor application. Name, email, and username are fetched from the authenticated user's account.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Application submitted successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "409", description = "User is already an instructor", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "500", description = "Server error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
        }
    )
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/apply")
    public ResponseEntity<Map<String, String>> apply(@Valid @RequestBody InstructorApplicationRequestDTO dto) {
        try {
            String username = getAuthenticatedUsername();
            service.submitApplication(dto, username);
            return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
        } catch (IllegalStateException e) {
            logger.error("Application submission failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (DataAccessException e) {
            logger.error("Database error during application submission: {}", e.getMessage());
            String errorMessage = e.getMostSpecificCause().getMessage().contains("value too long")
                ? "Input too long for one or more fields (e.g., qualifications, courses, URLs, or aboutMe)"
                : "Invalid input: " + e.getMostSpecificCause().getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", errorMessage));
        } catch (Exception e) {
            logger.error("Unexpected error during application submission: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Submission failed: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Get all instructor applications",
        description = "Allows an admin to retrieve all instructor applications.",
        responses = {
            @ApiResponse(responseCode = "200", description = "List of applications", content = @Content(mediaType = "application/json", schema = @Schema(implementation = InstructorApplicationDTO.class))),
            @ApiResponse(responseCode = "500", description = "Server error")
        }
    )
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/applications")
    public ResponseEntity<List<InstructorApplicationDTO>> getAllApplications() {
        List<InstructorApplicationDTO> applications = service.getAllApplications();
        logger.debug("Returning {} applications", applications.size());
        applications.forEach(app -> logger.debug("Application ID: {}, approved: {}", app.getId(), app.isApproved()));
        return ResponseEntity.ok(applications);
    }

    @Operation(
        summary = "Approve an instructor application",
        description = "Allows an admin to approve an instructor application.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Application approved successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "500", description = "Server error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
        }
    )
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve")
    public ResponseEntity<Map<String, String>> approveApplication(
        @Parameter(description = "ID of the application to approve", required = true) @RequestParam Long applicationId
    ) {
        try {
            service.approveApplication(applicationId);
            return ResponseEntity.ok(Map.of("message", "Application approved successfully"));
        } catch (Exception e) {
            logger.error("Error approving application ID {}: {}", applicationId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}