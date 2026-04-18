package com.hofgen.auth.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue("company")
public class Company extends User {
    private String companyName;
    private String empName;

    public Company() {
    }

    public Company(Long id, String email, String password, String type, String companyName, String empName) {
        super(id, email, password, type);
        this.companyName = companyName;
        this.empName = empName;
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

    @Override
    public String getName() {
        return companyName;
    }
}
