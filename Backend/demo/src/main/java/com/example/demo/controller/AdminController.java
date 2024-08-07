package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Admin;
import com.example.demo.service.AdminService;

@RestController
public class AdminController {
    @Autowired
    AdminService as;

    @PostMapping("/api/admin")
    public ResponseEntity<Admin> create(@RequestBody Admin ae) {
        Admin obj = as.addAdminn(ae);

        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin")
    public ResponseEntity<List<Admin>> getAll() {
        List<Admin> obj = as.getAllAdmin();
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }
}
