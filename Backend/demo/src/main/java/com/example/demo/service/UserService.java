package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepo;

@Service
public class UserService {

    @Autowired
    UserRepo ur;

    public User registerUser(User user) {

        String email = user.getEmail();

        boolean userFlag = email.startsWith("7278") && email.endsWith("@skct.edu.in");
        if (userFlag) {
            user.setRole("student");
            return ur.save(user);
        } else {
            return null;
        }
    }

    public List<User> getAllUser() {
        return ur.findAll();
    }

}
