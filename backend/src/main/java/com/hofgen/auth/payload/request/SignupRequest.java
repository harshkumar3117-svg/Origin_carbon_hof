package com.hofgen.auth.payload.request;

public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private String type;
    private String companyName;
    private String empName;

    public SignupRequest() {
    }

    public SignupRequest(String email, String password, String name, String type, String companyName, String empName) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.type = type;
        this.companyName = companyName;
        this.empName = empName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }
}
