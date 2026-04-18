package com.hofgen.auth.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue("individual")
public class Individual extends User {
    private String name;

    public Individual() {
    }

    public Individual(Long id, String email, String password, String type, String name) {
        super(id, email, password, type);
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
