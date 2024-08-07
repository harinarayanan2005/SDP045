package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepo;

@Service
public class AdminService {
    @Autowired
    AdminRepo ar;

    public Admin addAdminn(Admin admin) {
        String email = admin.getEmail();
        boolean adminFlag = email.endsWith("@skct.edu.in") && (!(email.startsWith("7278")));
        if (adminFlag) {
            admin.setRole("admin");
            return ar.save(admin);
        } else {
            return null;
        }
    }

    public List<Admin> getAllAdmin() {
        return ar.findAll();
    }

}
