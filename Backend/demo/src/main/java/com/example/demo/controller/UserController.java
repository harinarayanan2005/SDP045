package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.service.UserService;

@RestController
public class UserController {
    @Autowired
    UserService us;

    @PostMapping("/api/user")
    public ResponseEntity<User> create(@RequestBody User ue) {
        User obj = us.registerUser(ue);
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @GetMapping("/api/user")
    public ResponseEntity<List<User>> getAll() {
        List<User> obj = us.getAllUser();
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

}
