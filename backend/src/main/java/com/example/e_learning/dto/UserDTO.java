
package com.example.e_learning.dto;

public class UserDTO {
	private long id;
    private String name;
    private String email;
    private String username;
    private String password;
    private String role;


    public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}


}
