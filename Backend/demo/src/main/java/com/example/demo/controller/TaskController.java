package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Task;
import com.example.demo.service.TaskService;

@RestController
public class TaskController {
    @Autowired
    TaskService ts;

    @PostMapping("/api/task")
    public ResponseEntity<Task> create(@RequestBody Task te) {
        return new ResponseEntity<>(ts.addTask(te), HttpStatus.CREATED);
    }

    @GetMapping("/api/task")
    public ResponseEntity<List<Task>> getAll() {
        List<Task> obj = ts.getAllTask();
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
